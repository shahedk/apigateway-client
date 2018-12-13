let _apiEndPoint = "";
let _serviceName = "";

function validateApiKey(req, res, next){
    
    if(_apiEndPoint.length === 0 || _serviceName.length === 0){
        throw new Error("Please initialize apigateway-client and specify 'API end point' and 'service name'");
    }
    
    let apiKey = req.headers.apikey !== undefined ? req.headers.apikey : req.params.apikey;
    let apiSecret = req.headers.apisecret !== undefined ? req.headers.apisecret : req.params.apisecret;
    
    // Check if apiKey and api secrect is available in request
    if(apiKey === undefined || apiKey.length == 0 || 
       apiSecret === undefined || apiSecret.length == 0){
        
        res.send(401,"apikey and/or apisecret missing");
        next();
    }
    else{   
        // Check if ApiKey && ApiSecret is valid
        //TODO: Replace dummy code with real validation
        if( apiKey.length > 0 && apiSecret.length > 0){
            return next();
        }
        else{
            res.send(401, "apikey and/or apisecret is not valid")
        }
    }
}

function init(apiEndPoint, serviceName){
    _apiEndPoint = apiEndPoint;
    _serviceName = serviceName;
    
    return validateApiKey;
}


module.exports = {
    validateApiKey : validateApiKey,
    init : init,
    configure : init
}