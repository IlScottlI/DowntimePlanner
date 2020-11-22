(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)}else if(typeof module==="object"&&typeof module.exports==="object"){module.exports=factory()}else{root.Cldr=factory()}})(this,function(){var arrayIsArray=Array.isArray||function(obj){return Object.prototype.toString.call(obj)==="[object Array]"};var pathNormalize=function(path,attributes){if(arrayIsArray(path)){path=path.join("/")}if(typeof path!=="string"){throw new Error('invalid path "'+path+'"')}path=path.replace(/^\//,"").replace(/^cldr\//,"");path=path.replace(/{[a-zA-Z]+}/g,function(name){name=name.replace(/^{([^}]*)}$/,"$1");return attributes[name]});return path.split("/")};var arraySome=function(array,callback){var i,length;if(array.some){return array.some(callback)}for(i=0,length=array.length;i<length;i++){if(callback(array[i],i,array)){return true}}return false};var coreLikelySubtags=function(Cldr,cldr,subtags,options){var match,matchFound,language=subtags[0],script=subtags[1],sep=Cldr.localeSep,territory=subtags[2],variantsAndUnicodeLocaleExtensions=subtags.slice(3,4);options=options||{};if(language!=="und"&&script!=="Zzzz"&&territory!=="ZZ"){return[language,script,territory].concat(variantsAndUnicodeLocaleExtensions)}if(typeof cldr.get("supplemental/likelySubtags")==="undefined"){return}matchFound=arraySome([[language,script,territory],[language,territory],[language,script],[language],["und",script]],function(test){return match=!/\b(Zzzz|ZZ)\b/.test(test.join(sep))&&cldr.get(["supplemental/likelySubtags",test.join(sep)])});if(matchFound){match=match.split(sep);return[language!=="und"?language:match[0],script!=="Zzzz"?script:match[1],territory!=="ZZ"?territory:match[2]].concat(variantsAndUnicodeLocaleExtensions)}else if(options.force){return cldr.get("supplemental/likelySubtags/und").split(sep)}else{return}};var coreRemoveLikelySubtags=function(Cldr,cldr,maxLanguageId){var match,matchFound,language=maxLanguageId[0],script=maxLanguageId[1],territory=maxLanguageId[2],variants=maxLanguageId[3];matchFound=arraySome([[[language,"Zzzz","ZZ"],[language]],[[language,"Zzzz",territory],[language,territory]],[[language,script,"ZZ"],[language,script]]],function(test){var result=coreLikelySubtags(Cldr,cldr,test[0]);match=test[1];return result&&result[0]===maxLanguageId[0]&&result[1]===maxLanguageId[1]&&result[2]===maxLanguageId[2]});if(matchFound){if(variants){match.push(variants)}return match}return maxLanguageId};var coreSubtags=function(locale){var aux,unicodeLanguageId,subtags=[];locale=locale.replace(/_/,"-");aux=locale.split("-u-");if(aux[1]){aux[1]=aux[1].split("-t-");locale=aux[0]+(aux[1][1]?"-t-"+aux[1][1]:"");subtags[4]=aux[1][0]}unicodeLanguageId=locale.split("-t-")[0];aux=unicodeLanguageId.match(/^(([a-z]{2,3})(-([A-Z][a-z]{3}))?(-([A-Z]{2}|[0-9]{3}))?)((-([a-zA-Z0-9]{5,8}|[0-9][a-zA-Z0-9]{3}))*)$|^(root)$/);if(aux===null){return["und","Zzzz","ZZ"]}subtags[0]=aux[10]||aux[2]||"und";subtags[1]=aux[4]||"Zzzz";subtags[2]=aux[6]||"ZZ";if(aux[7]&&aux[7].length){subtags[3]=aux[7].slice(1)}return subtags};var arrayForEach=function(array,callback){var i,length;if(array.forEach){return array.forEach(callback)}for(i=0,length=array.length;i<length;i++){callback(array[i],i,array)}};var bundleLookup=function(Cldr,cldr,minLanguageId){var availableBundleMap=Cldr._availableBundleMap,availableBundleMapQueue=Cldr._availableBundleMapQueue;if(availableBundleMapQueue.length){arrayForEach(availableBundleMapQueue,function(bundle){var existing,maxBundle,minBundle,subtags;subtags=coreSubtags(bundle);maxBundle=coreLikelySubtags(Cldr,cldr,subtags);minBundle=coreRemoveLikelySubtags(Cldr,cldr,maxBundle);minBundle=minBundle.join(Cldr.localeSep);existing=availableBundleMapQueue[minBundle];if(existing&&existing.length<bundle.length){return}availableBundleMap[minBundle]=bundle});Cldr._availableBundleMapQueue=[]}return availableBundleMap[minLanguageId]||null};var objectKeys=function(object){var i,result=[];if(Object.keys){return Object.keys(object)}for(i in object){result.push(i)}return result};var createError=function(code,attributes){var error,message;message=code+(attributes&&JSON?": "+JSON.stringify(attributes):"");error=new Error(message);error.code=code;arrayForEach(objectKeys(attributes),function(attribute){error[attribute]=attributes[attribute]});return error};var validate=function(code,check,attributes){if(!check){throw createError(code,attributes)}};var validatePresence=function(value,name){validate("E_MISSING_PARAMETER",typeof value!=="undefined",{name:name})};var validateType=function(value,name,check,expected){validate("E_INVALID_PAR_TYPE",check,{expected:expected,name:name,value:value})};var validateTypePath=function(value,name){validateType(value,name,typeof value==="string"||arrayIsArray(value),"String or Array")};var isPlainObject=function(obj){return obj!==null&&""+obj==="[object Object]"};var validateTypePlainObject=function(value,name){validateType(value,name,typeof value==="undefined"||isPlainObject(value),"Plain Object")};var validateTypeString=function(value,name){validateType(value,name,typeof value==="string","a string")};var resourceGet=function(data,path){var i,node=data,length=path.length;for(i=0;i<length-1;i++){node=node[path[i]];if(!node){return undefined}}return node[path[i]]};var coreSetAvailableBundles=function(Cldr,json){var bundle,availableBundleMapQueue=Cldr._availableBundleMapQueue,main=resourceGet(json,["main"]);if(main){for(bundle in main){if(main.hasOwnProperty(bundle)&&bundle!=="root"&&availableBundleMapQueue.indexOf(bundle)===-1){availableBundleMapQueue.push(bundle)}}}};var alwaysArray=function(somethingOrArray){return arrayIsArray(somethingOrArray)?somethingOrArray:[somethingOrArray]};var jsonMerge=function(){var merge=function(){var destination={},sources=[].slice.call(arguments,0);arrayForEach(sources,function(source){var prop;for(prop in source){if(prop in destination&&typeof destination[prop]==="object"&&!arrayIsArray(destination[prop])){destination[prop]=merge(destination[prop],source[prop])}else{destination[prop]=source[prop]}}});return destination};return merge}();var coreLoad=function(Cldr,source,jsons){var i,j,json;validatePresence(jsons[0],"json");for(i=0;i<jsons.length;i++){json=alwaysArray(jsons[i]);for(j=0;j<json.length;j++){validateTypePlainObject(json[j],"json");source=jsonMerge(source,json[j]);coreSetAvailableBundles(Cldr,json[j])}}return source};var itemGetResolved=function(Cldr,path,attributes){var normalizedPath=pathNormalize(path,attributes);return resourceGet(Cldr._resolved,normalizedPath)};var Cldr=function(locale){this.init(locale)};Cldr._alwaysArray=alwaysArray;Cldr._coreLoad=coreLoad;Cldr._createError=createError;Cldr._itemGetResolved=itemGetResolved;Cldr._jsonMerge=jsonMerge;Cldr._pathNormalize=pathNormalize;Cldr._resourceGet=resourceGet;Cldr._validatePresence=validatePresence;Cldr._validateType=validateType;Cldr._validateTypePath=validateTypePath;Cldr._validateTypePlainObject=validateTypePlainObject;Cldr._availableBundleMap={};Cldr._availableBundleMapQueue=[];Cldr._resolved={};Cldr.localeSep="-";Cldr.load=function(){Cldr._resolved=coreLoad(Cldr,Cldr._resolved,arguments)};Cldr.prototype.init=function(locale){var attributes,language,maxLanguageId,minLanguageId,script,subtags,territory,unicodeLocaleExtensions,variant,sep=Cldr.localeSep;validatePresence(locale,"locale");validateTypeString(locale,"locale");subtags=coreSubtags(locale);unicodeLocaleExtensions=subtags[4];variant=subtags[3];maxLanguageId=coreLikelySubtags(Cldr,this,subtags,{force:true})||subtags;language=maxLanguageId[0];script=maxLanguageId[1];territory=maxLanguageId[2];minLanguageId=coreRemoveLikelySubtags(Cldr,this,maxLanguageId).join(sep);this.attributes=attributes={bundle:bundleLookup(Cldr,this,minLanguageId),minlanguageId:minLanguageId,maxLanguageId:maxLanguageId.join(sep),language:language,script:script,territory:territory,region:territory,variant:variant};unicodeLocaleExtensions&&("-"+unicodeLocaleExtensions).replace(/-[a-z]{3,8}|(-[a-z]{2})-([a-z]{3,8})/g,function(attribute,key,type){if(key){attributes["u"+key]=type}else{attributes["u"+attribute]=true}});this.locale=locale};Cldr.prototype.get=function(path){validatePresence(path,"path");validateTypePath(path,"path");return itemGetResolved(Cldr,path,this.attributes)};Cldr.prototype.main=function(path){validatePresence(path,"path");validateTypePath(path,"path");validate("E_MISSING_BUNDLE",this.attributes.bundle!==null,{locale:this.locale});path=alwaysArray(path);return this.get(["main/{bundle}"].concat(path))};return Cldr});