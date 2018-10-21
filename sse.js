const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

module.exports = function(req, res, next){
    res.sseSetup = function(){
        res.writeHead(200, SSE_RESPONSE_HEADER)
    }
    
    res.sseSend = function(data){
        if(!data)
            res.write(':\n\n');
        else
            res.write('data: ' + JSON.stringify(data) + ' \n\n'); 
    }
    
    next()
}