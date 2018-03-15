
import { Injectable } from "@angular/core";

export enum OperationType{
  None, Add,Substract,Multiply, Divide, StartBlock,EndBlock
}


export class OperationEvent{
  /**
   *
   */
  constructor(public value:number,public type:OperationType) {


  }
}

@Injectable()
export class CalculatorService{
  _operations=new Array<OperationEvent>();

constructor() {

 this.reset();
}

get Operations(){ return  this._operations;}

  public register(ev:OperationEvent){
    if (isNaN(ev.value)) return;
    this._operations.push(ev);
  }

  body:BlockExpression;
reset(){
  this.body=new BlockExpression();
  this._operations=[];
  this.lastResult=0;
}

  calculate(): void {
    this.body=new BlockExpression();
    let currentBody=this.body;
    this._operations.forEach(item => {

      switch(item.type){
        case OperationType.Add:
            let parent=this.body;
            if (currentBody.parent) parent=currentBody.parent;

            let b=new BlockExpression(parent);
            b.Add(new ConstantExpression(item.value));
            currentBody=b;
            break;
         case OperationType.Substract:
            let b2=new BlockExpression(currentBody);
            b2.Add(new ConstantExpression(-item.value));
            currentBody=b2;
            break;
         case OperationType.Multiply:
         var right=new ConstantExpression(item.value);
         currentBody.replaceLast(new BinaryExpression(currentBody.Previous,right,OperationType.Multiply));
         break;
         case OperationType.StartBlock:
         let b3=new BlockExpression(currentBody);
         b3.Add(new ConstantExpression(0));
         currentBody=b3;
         break;
         case OperationType.StartBlock:
         currentBody=currentBody.parent;
         break;
        }
    });

    this.lastResult=this.body.Calculate();
    console.log(this.body);
  }
 public lastResult=0;
}

class Expression{
  Calculate():number{
      return 0;
  }
}

class ConstantExpression extends Expression{

  constructor(public value:number) {
    super();
  }
  Calculate():number{
    return this.value;
  }
}

class BinaryExpression extends Expression{

  constructor(public left:Expression, public right:Expression,public type:OperationType) {
    super();

  }

  Calculate(){
    switch(this.type){
      case OperationType.Add: return this.left.Calculate()+this.right.Calculate();
      case OperationType.Multiply: return this.left.Calculate()*this.right.Calculate();

    }
  }
}

class BlockExpression extends Expression{

  replaceLast(expr:BinaryExpression): any {
  this._list.pop();
  this._list.push(expr);
  }
private _list= new Array<Expression>();

  constructor(public parent?:BlockExpression) {
    super();

   if(parent) parent.Add(this);
  }

  Add(expr:Expression){
      this._list.push(expr);
  }



  get Previous(): Expression { return this._list[this._list.length-1]}

  Calculate(){
    var rez=0;
    for(let item of this._list) rez+=item.Calculate();
    return rez;
  }
}
