const request = require('request');

let _apiEndPoint = "";
let _serviceName = "";

function validateApiKey(req, res, next){
    
    if(_apiEndPoint.length === 0 || _serviceName.length === 0){
        throw new Error("Please configure apigateway-client and specify 'API end point' and 'service name'");
    }
    
    let apiKey = req.headers.apikey !== undefined ? req.headers.apikey : req.params.apikey;
    let apiSecret = req.headers.apisecret !== undefined ? req.headers.apisecret : req.params.apisecret;
    
    // Check if apiKey and api secrect is available in request
    if(apiKey === undefined || apiKey.length == 0 || 
       apiSecret === undefined || apiSecret.length == 0){
        
        res.send(401,"apikey and/or apisecret missing");
        return;
    }
    
    // Check if ApiKey && ApiSecret is valid
    let apiName = getApiName(req);
    
    let opt = {};
    opt.url = _apiEndPoint + "/api/isvalid/"+_serviceName+"?api=" + apiName + '&httpMethod=' + req.method;
    opt.headers = {
        'apikey' : apiKey,
        'apisecret' : apiSecret
    };
    
    request(opt, function(err, res2, body){
        
        if(err){
            throw err;
        }
        
        if(res2 && res2.statusCode == 200){
            let result = JSON.parse(body);
            
            if(result.isValid){
                req.keyId = result.keyId;
                return next();
            }
            else{
                res.send(401, result.message);
                return;
            }
        }
        else{
            res.send(401, "Unexpected error occured while validating apikey. Status Code: " + res2.statusCode);
            return;
        }
    });
}



function getApiName(req){
    var tokens = req.url.split('/');
    
    if(tokens.length > 1){
        let apiName = tokens[1];
        if(apiName.includes('?')){
            return apiName.split('?')[0];
        }
        else{
            return apiName;
        }
    }
    else{
        return "";
    }
}



function init(apiEndPoint, serviceName){
    
    apiEndPoint = apiEndPoint.trim();
    
    if(apiEndPoint.endsWith("/")){
 
        // Remove the trailing "/"
        apiEndPoint = apiEndPoint.substr(0, apiEndPoint.length-1);
    }
    
    _apiEndPoint = apiEndPoint;
    _serviceName = serviceName;
    
    return validateApiKey;
}



module.exports = {
    validateApiKey : validateApiKey,
    init : init,
    configure : init
}
