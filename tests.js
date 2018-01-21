(function(){
let numbers=[1,2,3];
report(query().select().from(numbers).execute())
report(query().select().execute())
report(query().from(numbers).execute())
report(query().execute())
report(query().from(numbers).select().execute())

let persons=[
{name:'Peter',profession:'teacher',age:20,maritalStatus:'married'},
{name:'Michael',profession:'teacher',age:50,maritalStatus:'single'},
{name:'Peter',profession:'teacher',age:20,maritalStatus:'married'},
{name:'Anna',profession:'scientific',age:20,maritalStatus:'married'},
{name:'Rose',profession:'scientific',age:50,maritalStatus:'married'},
{name:'Anna',profession:'scientific',age:20,maritalStatus:'single'},
{name:'Anna',profession:'politician',age:50,maritalStatus:'married'}
];



function profession(person){
return person.profession;
}

//SELECTprofessionFROMpersons
report(query().select(profession).from(persons).execute())
//["teacher","teacher","teacher","scientific","scientific","scientific","politician"]);
report(query().select(profession).execute())
////[]


function isTeacher(person){
return person.profession==='teacher';
}

//SELECTprofessionFROMpersonsWHEREprofession="teacher"
report(query().select(profession).from(persons).where(isTeacher).execute())
//["teacher","teacher","teacher"]);


//SELECT*FROMpersonsWHEREprofession="teacher"
report(query().from(persons).where(isTeacher).execute())
//persons.slice(0,3));

function name(person){
return person.name;
}

//SELECTnameFROMpersonsWHEREprofession="teacher"
report(query().select(name).from(persons).where(isTeacher).execute())
//["Peter","Michael","Peter"]);
report(query().where(isTeacher).from(persons).select(name).execute())
//,["Peter","Michael","Peter"]);






persons=[
{name:'Peter',profession:'teacher',age:20,maritalStatus:'married'},
{name:'Michael',profession:'teacher',age:50,maritalStatus:'single'},
{name:'Peter',profession:'teacher',age:20,maritalStatus:'married'},
{name:'Anna',profession:'scientific',age:20,maritalStatus:'married'},
{name:'Rose',profession:'scientific',age:50,maritalStatus:'married'},
{name:'Anna',profession:'scientific',age:20,maritalStatus:'single'},
{name:'Anna',profession:'politician',age:50,maritalStatus:'married'}
];

function profession(person){
return person.profession;
}

//SELECT*FROMpersonsGROUPBYprofession<-BadinSQLbutpossibleinJavaScript
report(query().select().from(persons).groupBy(profession).execute())
//,[["teacher",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]],["scientific",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"},{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"},{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]],["politician",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]);

function isTeacher(person){
return person.profession==='teacher';
}

//SELECT*FROMpersonsWHEREprofession='teacher'GROUPBYprofession
report(query().select().from(persons).where(isTeacher).groupBy(profession).execute())
//,[["teacher",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]]]);

function professionGroup(group){
return group[0];
}

//SELECTprofessionFROMpersonsGROUPBYprofession
report(query().select(professionGroup).from(persons).groupBy(profession).execute())
//,["teacher","scientific","politician"]);

function name(person){
return person.name;
}

//SELECT*FROMpersonsWHEREprofession='teacher'GROUPBYprofession,name
report(query().select().from(persons).groupBy(profession,name).execute())
//,[["teacher",[["Peter",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]],["Michael",[{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"}]]]],["scientific",[["Anna",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"},{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]],["Rose",[{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"}]]]],["politician",[["Anna",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]]]


function age(person){
return person.age;
}

function maritalStatus(person){
return person.maritalStatus;
}

//SELECT*FROMpersonsWHEREprofession='teacher'GROUPBYprofession,name,age
report(query().select().from(persons).groupBy(profession,name,age,maritalStatus).execute())
//,[["teacher",[["Peter",[[20,[["married",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]]]]]],["Michael",[[50,[["single",[{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"}]]]]]]]],["scientific",[["Anna",[[20,[["married",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"}]],["single",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]]]]]],["Rose",[[50,[["married",[{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"}]]]]]]]],["politician",[["Anna",[[50,[["married",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]]]]]]]);

function professionCount(group){
return[group[0],group[1].length];
}

//SELECTprofession,count(profession)FROMpersonsGROUPBYprofession
report(query().select(professionCount).from(persons).groupBy(profession).execute())
//,[["teacher",3],["scientific",3],["politician",1]]);

function naturalCompare(value1,value2){
if(value1<value2){
return-1;
}else if(value1>value2){
return 1;
}else{
return 0;
}
}

//SELECTprofession,count(profession)FROMpersonsGROUPBYprofessionORDERBYprofession
report(query().select(professionCount).from(persons).groupBy(profession).orderBy(naturalCompare).execute())
//,[["politician",1],["scientific",3],["teacher",3]]);



function isEven(number){
return number%2===0;
}

function parity(number){
return isEven(number)?'even':'odd';
}

function isPrime(number){
if(number<2){
return false;
}
var divisor=2;
for(;number%divisor!==0;divisor++);
return divisor===number;
}

function prime(number){
return isPrime(number)?'prime':'divisible';
}

numbers=[1,2,3,4,5,6,7,8,9];

//SELECT*FROMnumbers
report(query().select().from(numbers).execute())

//SELECT*FROMnumbersGROUPBYparity
report(query().select().from(numbers).groupBy(parity).execute())
//,[["odd",[1,3,5,7,9]],["even",[2,4,6,8]]]);

//SELECT*FROMnumbersGROUPBYparity,isPrime
report(query().select().from(numbers).groupBy(parity,prime).execute())
//,[["odd",[["divisible",[1,9]],["prime",[3,5,7]]]],["even",[["prime",[2]],["divisible",[4,6,8]]]]]);

function odd(group){
return group[0]==='odd';
}

//SELECT*FROMnumbersGROUPBYparityHAVING
report(query().select().from(numbers).groupBy(parity).having(odd).execute())
//,[["odd",[1,3,5,7,9]]]);

function descendentCompare(number1,number2){
return number2-number1;
}

//SELECT*FROMnumbersORDERBYvalueDESC
report(query().select().from(numbers).orderBy(descendentCompare).execute())
//,[9,8,7,6,5,4,3,2,1]);

function lessThan3(number){
return number<3;
}

function greaterThan4(number){
return number>4;
}

//SELECT*FROMnumberWHEREnumber<3ORnumber>4
report(query().select().from(numbers).where(lessThan3,greaterThan4).execute())
//,[1,2,5,6,7,8,9]);


persons=[
['Peter',3],
['Anna',4],
['Peter',7],
['Michael',10]
];

function nameGrouping(person){
return person[0];
}

function sumValues(value){
return[value[0],value[1].reduce(function(result,person){
return result+person[1];
},0)];
}

function naturalCompare(value1,value2){
if(value1<value2){
return-1;
}else if(value1>value2){
return 1;
}else{
return 0;
}
}
//SELECTname,sum(value)FROMpersonsORDERBYnaturalCompareGROUPBYnameGrouping
report(query().select(sumValues).from(persons).orderBy(naturalCompare).groupBy(nameGrouping).execute())
//,[["Anna",4],["Michael",10],["Peter",10]]);

numbers=[1,2,1,3,5,6,1,2,5,6];

function id(value){
return value;
}

function frequency(group){
return{value:group[0],frequency:group[1].length};
}

//SELECTnumber,count(number)FROMnumbersGROUPBYnumber
report(query().select(frequency).from(numbers).groupBy(id).execute())
//,[{"value":1,"frequency":3},{"value":2,"frequency":2},{"value":3,"frequency":1},{"value":5,"frequency":2},{"value":6,"frequency":2}]);

function greatThan1(group){
return group[1].length>1;
}

function isPair(group){
return group[0]%2===0;
}

//SELECTnumber,count(number)FROMnumbersGROUPBYnumberHAVINGcount(number)>1ANDisPair(number)
report(query().select(frequency).from(numbers).groupBy(id).having(greatThan1).having(isPair).execute())
//,[{"value":2,"frequency":2},{"value":6,"frequency":2}]);

var teachers=[
{
teacherId:'1',
teacherName:'Peter'
},
{
teacherId:'2',
teacherName:'Anna'
}
];


var students=[
{
studentName:'Michael',
tutor:'1'
},
{
studentName:'Rose',
tutor:'2'
}
];

function teacherJoin(join){
return join[0].teacherId===join[1].tutor;
}

function student(join){
return{studentName:join[1].studentName,teacherName:join[0].teacherName};
}

//SELECTstudentName,teacherNameFROMteachers,studentsWHEREteachers.teacherId=students.tutor
report(query().select(student).from(teachers,students).where(teacherJoin).execute())
//,[{"studentName":"Michael","teacherName":"Peter"},{"studentName":"Rose","teacherName":"Anna"}]);


var numbers1=[1,2];
var numbers2=[4,5];

report(query().select().from(numbers1,numbers2).execute())
//,[[1,4],[1,5],[2,4],[2,5]]);

function tutor1(join){
return join[1].tutor==="1";
}

//SELECTstudentName,teacherNameFROMteachers,studentsWHEREteachers.teacherId=students.tutorANDtutor=1
report(query().select(student).from(teachers,students).where(teacherJoin).where(tutor1).execute())
//,[{"studentName":"Michael","teacherName":"Peter"}]);

})()

