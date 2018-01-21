var query = function() {
var DB=[];
var JOIN =[];
var groups = [];
var q = {
    _select : (el) => 'all',
    _from : DB,
    _where : [],
    _groupBy : [],
    _orderBy : [],
    _having : [],
    _join:[],
    repeatClause : {_select : false,_from: false,_groupBy:false,orderBy:false},
    default: function(){
       this._select = (el) => 'all';
//         from : DB,
       this._where = [];
       this._groupBy = [];
       this._orderBy = [];
       this._having = [];
       this._join = [];
       groups = [];
       JOIN = [];
       repeatClause:{false,false,false,false};
    }
};

function execute(){
   var result;
   if(q._where.length > 0){
        if(JOIN !== [] && JOIN.length > 1 && JOIN.every(arry => Array.isArray(arry))){
            DB=JOIN[0].map(function(el){
              let joinsDouble = JOIN.slice(1).map(tab => tab.filter(row => q._where.every(fns => fns.some(fn => fn([el,row])))));
              let joins=[];
              if(joinsDouble && joinsDouble.length > 0){
                 joins.push(el);
                 joinsDouble.forEach(_tab => joins.push(..._tab)); 
              }   
              return joins;
            });
             result = DB.map(function(el){
                try{
                   if(q._select(el) === 'all'){
                  return el;
                }else{
                  return q._select(el);
                } 
                }catch(err){
                  return undefined;
                }   
                });
                if(DB && DB.length > 0){
                DB = DB.filter(row => row !== undefined);
                }
        }else{
            result = DB.filter( el => q._where.every(fns => fns.some(fn => fn(el)))).map(function(el){
            try{
               if(q._select(el) === 'all'){
              return el;
            }else{
              return q._select(el);
            } 
            }catch(err){
              return undefined;
            }   
            });
      }
       
   }else{
     if(JOIN !== [] && JOIN.length > 1 && JOIN.every(arry => Array.isArray(arry))){
          JOIN[0].forEach(function(el){
             JOIN.slice(1).forEach(tab => tab.forEach(el2 => DB.push([el,el2])));     
          });
          result= DB.map(function(el){
          try{
             if(q._select(el) === 'all'){
            return el;
          }else{
            return q._select(el);
          } 
          }catch(err){
            return undefined;
          }

        });
     }else{
           result= DB.map(function(el){
          try{
             if(q._select(el) === 'all'){
            return el;
          }else{
            return q._select(el);
          } 
          }catch(err){
            return undefined;
          }

        });
     }
    
  }
 var groupRec = function(groups,index,data){
      let result = [];
     if(index >= groups.length) return data ;
     if(data && data.length > 0 ){
         let group = groups[index](data[0]);
         while(group){
            let resultGroup = [];
            resultGroup.push(group);
            let dataGroup = data.filter(el => groups[index](el) === group);
            data = data.filter(el => groups[index](el) !== group);
            resultGroup.push(groupRec(groups.slice(1),index,dataGroup));
             if(data && data.length > 0 ){
                group = groups[index](data[0]); 
             }else{
                 group = null;
             }
            if(q._having.length >  0){
                if(q._having.every(fn => fn(resultGroup))){
                   result.push(resultGroup);
                }
            }else{
             result.push(resultGroup);
            }          
         }
     
     }      
     return result;
 }
 if(q._groupBy.length !== 0){
     if(result.every(el => !el)){
        groups=result=groupRec(q._groupBy,0,DB).map(el => q._select(el));
        if(q._orderBy.length > 0){
        result= groups.map(el => {el.sort(...q._orderBy); return el}).sort(...q._orderBy);
       }
     }else{
       if(q._orderBy.length > 0){
        result= result.sort(...q._orderBy);
        }
       groups = result = groupRec(q._groupBy,0,result);

     }
         
 }else{
      if(q._orderBy.length > 0){       
       result= result.sort(...q._orderBy);
     }
 }
 
     return result.filter(el => el === 0 ||  el);   
 
}
function select(fn = (el)=> 'all'){
     if(q.repeatClause._select) throw new Error('Duplicate SELECT');
     q.repeatClause._select = true;
     q._select = fn;
     return {from: from,execute: execute,select: select,groupBy: groupBy,where: where}
}
function from(db,...rest){
     if(q.repeatClause._from) throw new Error('Duplicate FROM');
     q.repeatClause._from = true;
     if(rest.length === 0){
         DB = db;
     }else{
        JOIN = [db,...rest]
     }
    
     return {select: select,where: where,groupBy:groupBy,execute: execute,from:from,orderBy: orderBy}
}
function where(...filters){
  q._where.push(filters);
  return {orderBy : orderBy,groupBy:groupBy,execute: execute,from:from,where:where,select:select}
}
function orderBy(...compareFn){
     if(q.repeatClause._orderBy) throw new Error('Duplicate ORDERBY');
     q.repeatClause._orderBy = true;
     q._orderBy= compareFn;
     return {execute : execute,orderBy: orderBy,groupBy: groupBy}
}
function having(filters){
 q._having.push(filters);
 return {execute: execute,having: having}
}
function groupBy(...fns){
     if(q.repeatClause._groupBy) throw new Error('Duplicate GROUPBY');
     q.repeatClause._groupBy = true;
     q._groupBy = fns;
 return {orderBy : orderBy,execute: execute,having:having,groupBy: groupBy,from:from}
}


return {
  select: select,
  from: from,
  where: where,
  orderBy: orderBy,
  groupBy: groupBy,
  having: having,
  execute: execute
}
}
