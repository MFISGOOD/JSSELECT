var query = function() {
    var DB=[];
    var JOIN =[];
    var groups = [];
    var q = {
        _select_ : (el) => 'all',
        _from_ : DB,
        _where_ : [],
        _groupBy_ : [],
        _orderBy_ : [],
        _having_ : [],
        _join_:[],
        isRepeated : {_select_ : false,_from_: false,_groupBy_:false,_orderBy_:false},
        default: function(){
           this._select_ = (el) => 'all';
           //from : DB,
           this._where_ = [];
           this._groupBy_ = [];
           this._orderBy_ = [];
           this._having_ = [];
           this._join_ = [];
           groups = [];
           JOIN = [];
           isRepeated:{false,false,false,false};
        }
    };
    // And only
    function havingFilter(groups,filters){
          if(filters.length >  0){
               return groups.filter(group => filters.every(filter => filter(group)));
           }
           return groups;            
    } 
    function createGroup(...args){
       var group=[];
       group.push(...args);
       return group;
    }
    function recursiveGrouping (groupSelector,index,data){

          if(index >= groupSelector.length) return data ;
          if(!data ||  data.length === 0 ) return [];

          let groupsName = Array.from(new Set(data.map(el => groupSelector[index](el))));
          //return groups
          return groupsName.map(grpName => 
                                              createGroup(grpName
                                                        ,recursiveGrouping(groupSelector.slice(1)
                                                                                    ,index
                                                                                    ,data.filter(el => groupSelector[index](el) === grpName)
                                                                                    )
                                                        )
                                    )
           //data = data.filter(el => groupSelector[index](el) !== grpName);   
    }
    function _join(){
                    JOIN[0].forEach(function(el){
                          JOIN.slice(1).forEach(tab => tab.forEach(el2 => DB.push([el,el2])));     
                    });
                    return DB;
    }

    function _select(view){
           return   view.map(function(el){
                      try{
                          if(q._select_(el) === 'all'){
                            return el;
                          }else{
                            return q._select_(el);
                          } 
                      }catch(err){
                        return undefined;
                      }
                  });
    }

    function _joinWhere(){
                return  DB=JOIN[0].map(function(el){
                          let join = JOIN.slice(1).map(tab => tab.filter(row => q._where_.every(fns => fns.some(fn => fn([el,row])))));
                          let view=[];
                          if(join && join.length > 0){
                             view.push(el);
                             join.forEach(_tab => view.push(..._tab)); 
                          }   
                          return view;
                      });
    }

    function _where(){
       var result;
       if(q._where_.length > 0){
            if(JOIN !== [] && JOIN.length > 1 && JOIN.every(arry => Array.isArray(arry))){
                   result = _joinWhere();
                   result = _select(result);
                   if(DB && DB.length > 0){
                         DB = DB.filter(row => row !== undefined);
                    }
             }else{
                     result = DB.filter( el => q._where_.every(fns => fns.some(fn => fn(el))));
                     result=_select(result); 
             }     
       }else{
             if(JOIN !== [] && JOIN.length > 1 && JOIN.every(arry => Array.isArray(arry))){
                    result = _join();
              }else{
                    result=_select(DB);
              } 
       }
       return result;
    }
    function _groupBy(result){
       if(q._groupBy_.length !== 0){
            if(result.every(el => !el)){
               groups=result=recursiveGrouping(q._groupBy_,0,DB);
               groups=result=havingFilter(result, q._having_).map(el => q._select_(el));
               if(q._orderBy_.length > 0){
                   result= groups.map(el => {el.sort(...q._orderBy_); return el}).sort(...q._orderBy_);
                }
            }else{
           if(q._orderBy_.length > 0){
            result= result.sort(...q._orderBy_);
            }
             groups = result = recursiveGrouping(q._groupBy_,0,result);
             groups=result=havingFilter(result, q._having_);
            }

       }else{
          if(q._orderBy_.length > 0){       
           result= result.sort(...q._orderBy_);
         }
       }
       return result;
    }
    function execute(){
       var result;
       result = _where();
       result = _groupBy(result);
       q.default();
       return result.filter(el => el === 0 ||  el);   
    }
    function select(fn = (el)=> 'all'){
         if(q.isRepeated._select_) throw new Error('Duplicate SELECT');
         q.isRepeated._select_ = true;
         q._select_ = fn;
         return {from: from,execute: execute,select: select,groupBy: groupBy,where: where}
    }
    function from(db,...rest){
         if(q.isRepeated._from_) throw new Error('Duplicate FROM');
         q.isRepeated._from_ = true;
         if(rest.length === 0){
             DB = db;
         }else{
            JOIN = [db,...rest]
         }   
         return {select: select,where: where,groupBy:groupBy,execute: execute,from:from,orderBy: orderBy}
    }
    function where(...filters){
      q._where_.push(filters);
      return {orderBy : orderBy,groupBy:groupBy,execute: execute,from:from,where:where,select:select}
    }
    function orderBy(...compareFn){
         if(q.isRepeated._orderBy_) throw new Error('Duplicate ORDERBY');
         q.isRepeated._orderBy_ = true;
         q._orderBy_= compareFn;
         return {execute : execute,orderBy: orderBy,groupBy: groupBy}
    }
    function having(filters){
      q._having_.push(filters);
      return {execute: execute,having: having}
    }
    function groupBy(...fns){
         if(q.isRepeated._groupBy_) throw new Error('Duplicate GROUPBY');
         q.isRepeated._groupBy_ = true;
         q._groupBy_ = fns;
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
