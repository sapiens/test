
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



  private _actions=[];

  private _undos=[];

  reset() {

    this._actions=[];
    this._undos=[];
    this.updateActionsChanged();
    //this.formattedActions.next("");
   }
  add(action:any){

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


      this._undos=[];
      this.updateActionsChanged();
  }

  endInput(){
   let last=this._actions.pop();
   if(!this.isOperator(last)) this._actions.push(last);
   this.updateActionsChanged();
  }

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
    this.cantRedo= this._undos.length==0;
  }

  undo(){
    if (this._actions.length>0)
    {
      this._undos.push(this._actions.pop());

      this.updateActionsChanged();
    }
  }

  redo(){
   if(this._undos.length==0)   return;
   this._actions.push(this._undos.pop());
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

// class Case{
//   static For(val:any):Case{
//     return new Case(val);
//   }
//   constructor(private val:any){

//   }
//   when<T>(action:(item:T)=>void):Case{

//     var d=this.val as T;
//     console.log(d);
//       if (d!=undefined && d!==null){
//         action(d);
//       }
//       return this;
//   }
// }

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

      }
      return currentBlock;
  }

handleBlocks(item:BlockOperationEvent,currentBlock:BlockExpression):BlockExpression{
 console.log("from block");
  if (item.isEnd) return currentBlock.parent;
 var b=new BlockExpression(currentBlock);
 b.Add(new ConstantExpression(0));
 return b;
}

currentBlock;
  calculate(evs:Array<OperationEvent>): void {


    this.body = new BlockExpression();
    this.currentBlock = this.body;
    evs.forEach(item => {

     if(item instanceof NumericOperationEvent) this.currentBlock=this.handleNumerics(item as NumericOperationEvent,this.currentBlock);
     if(item instanceof BlockOperationEvent) this.currentBlock=this.handleBlocks(item as BlockOperationEvent,this.currentBlock);


      //    case OperationType.Multiply:
      //    var right=new ConstantExpression(item.value);
      //    currentBlock.replaceLast(new BinaryExpression(currentBlock.Previous,right,OperationType.Multiply));
      //    break;
      //    case OperationType.StartBlock:
      //    let b3=new BlockExpression(currentBlock);
      //    b3.Add(new ConstantExpression(0));
      //    currentBlock=b3;
      //    break;
      //    case OperationType.StartBlock:
      //    currentBlock=currentBlock.parent;
      //    break;
      //   }
    });

    this.lastResult = this.body.Calculate();
    //console.log(this.body);
  }
  public lastResult = 0;
}

class Expression {
  Calculate(): number {
    return 0;
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

    if (parent) parent.Add(this);
  }

  Add(expr: Expression) {
    this._list.push(expr);
  }



  get Previous(): Expression { return this._list[this._list.length - 1] }

  Calculate() {
    var rez = 0;
    for (let item of this._list) rez += item.Calculate();
    return rez;
  }
}
