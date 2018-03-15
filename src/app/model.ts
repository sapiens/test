
import { Injectable } from "@angular/core";
import { BehaviorSubject} from 'rxjs';

export enum OperatorType {
  None, Add, Substract, Multiply, Divide
}

export class OperationEvent {

}

export class NumericOperationEvent extends OperationEvent {

  constructor(public value: number, public type: OperatorType) {
    super();

  }
}

export class BlockOperationEvent extends OperationEvent {
  /**
   *
   */
  constructor(public type: OperatorType, public start: boolean) {
    super();
    this.isEnd=!start;
  }

  isEnd=false;
}


export class ValueAction{
    constructor(public value:number){

    }

    toString(){return this.value.toString()};
}

export class OperatorAction{
  /**
   *
   */
  constructor(public operator:OperatorType) {


  }

  format(type: OperatorType): string {
    switch (type) {
      case OperatorType.Add: return "+";
      case OperatorType.Substract: return "-";
      case OperatorType.Multiply: return "*";
      case OperatorType.Divide: return "/";
    }
  }
  toString(){return this.format(this.operator);};
}

export class BlockAction{
  constructor(public start:boolean){

  }

  toString(){return this.start?"(":")"};
}


@Injectable()
export class InputActionsService{


  isReset=new BehaviorSubject<boolean>(false);

  private _actions=[];

  private _redos=[];

  reset() {

    this._actions=[];
    this._redos=[];
    this.updateActionsChanged();
    this.ended=false;
    this.isReset.next(true);
   }
  add(action:any){
  if(this.ended) this.reset();
    if(this.isOperator(action)){
      let last=this._actions.pop();

      if(last!=undefined && !this.isOperator(last)) this._actions.push(last);
    }

    if(this.isBlock(action)){
      let block=<BlockAction>action;
      let last=this._actions.pop();
      if(this.isBlock(last)) {
        this.updateActionsChanged();
        return;
      }
      if(last!=undefined && !(!block.start && this.isOperator(last))) this._actions.push(last);
    }

    this._actions.push(action);


      this._redos=[];
      this.updateActionsChanged();
  }

  endInput(){
   let last=this._actions.pop();
   if(!this.isOperator(last)) this._actions.push(last);
   this.updateActionsChanged();
   this.ended=true;
  }

  private ended=false;
   private isOperator(action):boolean{

     return action instanceof OperatorAction;
   }
   private isValue(action):boolean{

     return action instanceof ValueAction;
   }
   private isBlock(action):boolean{

     return action instanceof BlockAction;
   }


  formattedActions:BehaviorSubject<string>= new BehaviorSubject<string>("");

 cantRedo=true;
 cantUndo=true;
  private updateActionsChanged() {
    this.formattedActions.next(this._actions.join(''));
    this.cantUndo = this._actions.length == 0;
    this.cantRedo= this._redos.length==0;
  }

  undo(){
    if (this._actions.length>0)
    {
      this._redos.push(this._actions.pop());

      this.updateActionsChanged();
    }
  }

  redo(){
   if(this._redos.length==0)   return;
   this._actions.push(this._redos.pop());
   this.updateActionsChanged();
  }

  getEvents():Array<OperationEvent>{
    let lastOperator=OperatorType.Add;
    let rez=new Array<OperationEvent>();
    for(let i=0;i<this._actions.length;i++){
      let act=this._actions[i];
      if (act instanceof ValueAction)  rez.push(this.processValue(act as ValueAction,lastOperator));
      if (act instanceof OperatorAction) lastOperator=(<OperatorAction>act).operator;
      if (act instanceof BlockAction) {
                rez.push(new BlockOperationEvent(lastOperator,(<BlockAction>act).start));
                lastOperator=OperatorType.Add;
      }

    }
    return rez;
  }


  private processValue(val:ValueAction,lastOp:OperatorType):NumericOperationEvent{
   return new NumericOperationEvent(val.value,lastOp);
  }
}


@Injectable()
export class CalculatorService {

  constructor() {

    this.reset();
  }


  body: BlockExpression;
  reset() {
    this.body = new BlockExpression();

    this.lastResult = 0;
  }

    handleNumerics(item:NumericOperationEvent,currentBlock:BlockExpression):BlockExpression{
    function doAdd(val:number){
      var b=new BlockExpression(currentBlock);
      currentBlock.Add(b);
      b.Add(new ConstantExpression(val))
    }

      switch(item.type){
        case OperatorType.Add:
        doAdd(item.value);
        break;
        case OperatorType.Substract:
        doAdd(-item.value);
        break;
        case OperatorType.Multiply:
         var right=new ConstantExpression(item.value);
         currentBlock.replaceLast(new BinaryExpression(currentBlock.Previous,right,OperatorType.Multiply));
         break;
        case OperatorType.Divide:
         var right=new ConstantExpression(item.value);
         currentBlock.replaceLast(new BinaryExpression(currentBlock.Previous,right,OperatorType.Divide));
         break;

      }
      return currentBlock;
  }

handleBlocks(item:BlockOperationEvent,currentBlock:BlockExpression):BlockExpression{


    if (item.isEnd) return currentBlock.parent;
    let prev=currentBlock.Previous;

  switch(item.type){

    case OperatorType.Add:
    let b=new BlockExpression(currentBlock);
    currentBlock.Add(b);
    return b;


    case OperatorType.Substract:

    let newB=new BlockExpression(currentBlock);
    currentBlock.Add(new NegateExpression(newB));

    return newB;

    case OperatorType.Multiply:
    let b2=new BlockExpression(currentBlock);
    currentBlock.replaceLast(new BinaryExpression(currentBlock.Previous,b2,OperatorType.Multiply));
    return b2;
    case OperatorType.Divide:
    let bd=new BlockExpression(currentBlock);
    currentBlock.replaceLast(new BinaryExpression(currentBlock.Previous,bd,OperatorType.Divide));
    return bd;

  }
return null;

}

  calculate(evs:Array<OperationEvent>): void {


    this.body = new BlockExpression();
    let currentBlock = this.body;
    evs.forEach(item => {

     if(item instanceof NumericOperationEvent) currentBlock=this.handleNumerics(item as NumericOperationEvent,currentBlock);
     if(item instanceof BlockOperationEvent) currentBlock=this.handleBlocks(item as BlockOperationEvent,currentBlock);


    });

    this.lastResult = this.body.Calculate();
    console.log(this.body);
  }
  public lastResult = 0;
}

class Expression {
  Calculate(): number {
    return 0;
  }
}

class NegateExpression extends Expression{
  /**
   *
   */
  constructor(private val:Expression) {
    super();

  }

  Calculate():number{
    return -this.val.Calculate();
  }
}

class ConstantExpression extends Expression {

  constructor(public value: number) {
    super();
  }
  Calculate(): number {
    return this.value;
  }
}

class BinaryExpression extends Expression {

  constructor(public left: Expression, public right: Expression, public type: OperatorType) {
    super();

  }

  Calculate() {
    switch (this.type) {
      case OperatorType.Add: return this.left.Calculate() + this.right.Calculate();
      case OperatorType.Multiply: return this.left.Calculate() * this.right.Calculate();
      case OperatorType.Divide: return this.left.Calculate() / this.right.Calculate();

    }
  }
}

class BlockExpression extends Expression {

  replaceLast(expr: BinaryExpression): any {
    this._list.pop();
    this._list.push(expr);
  }
  private _list = new Array<Expression>();

  constructor(public parent?: BlockExpression) {
    super();
  }

  setParent(parent:BlockExpression){
    this.parent=parent;
  }

  Add(expr: Expression) {
    this._list.push(expr);
  }

  addDefault(){
    this.Add(new ConstantExpression(0));
  }


  get Previous(): Expression { return this._list[this._list.length - 1] }

  Calculate() {
    var res = 0;
    for (let item of this._list) res += item.Calculate();
    return Math.round(res*10000)/10000;
  }
}
