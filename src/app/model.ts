
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
  constructor(public type: OperatorType, public begin: boolean) {
    super();

  }
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
      this._actions.push(action);
      this._undos=[];
      this.updateActionsChanged();
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
      this.cantRedo=false;
      this.updateActionsChanged();
    }
  }

  redo(){
   if(this._undos.length==0)   return;
   this.add(this._undos.pop());
  }

  getEvents():Array<OperationEvent>{
    let lastOperator=OperatorType.Add;
    let rez=new Array<OperationEvent>();
    for(let i=0;i<this._actions.length;i++){
      let act=this._actions[i];
      if (act instanceof ValueAction)  rez.push(this.processValue(act as ValueAction,lastOperator));
      if (act instanceof OperatorAction) lastOperator=(<OperatorAction>act).operator;
      if (act instanceof BlockAction) lastOperator=(<OperatorAction>act).operator;

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

  calculate(evs:Array<OperationEvent>): void {
    this.body = new BlockExpression();
    let currentBlock = this.body;
    evs.forEach(item => {

      // switch(item.type){
      //   case OperationType.Add:
      //       // let parent=this.body;
      //       // if (currentBlock.parent) parent=currentBlock.parent;

      //       let b=new BlockExpression(currentBlock);
      //       b.Add(new ConstantExpression(item.value));

      //       break;
      //    case OperationType.Substract:
      //       let b2=new BlockExpression(currentBlock);
      //       b2.Add(new ConstantExpression(-item.value));

      //       break;
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
    console.log(this.body);
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
