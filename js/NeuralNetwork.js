

class NeuralNetwork{

	//nb node for each layer
	nInput;
	nHidden;
	nOutput;

	//activations for nodes
	aInput;
	aHidden;
	aOutput;

	// weights
	wInput;
	wOutput;

	//last change in weights for momentum
	cInput;
	cOutput;

	constructor(nInput, nHidden, nOutput){
		this.nInput=nInput+1; //for bias node
		this.nHidden=nHidden;
		this.nOutput=nOutput;

		this.aInput= new Array (this.nInput);
        this.aInput=this.aInput.fill(1.0);
		this.aHidden=(new Array (nHidden)).fill(1.0);
		this.aOutput= (new Array (nOutput)).fill(1.0);

		this.wInput = makeRandMatrix (this.nInput , this.nHidden);
        //console.log ("wInput",this.wInput);
		this.wOutput = makeRandMatrix (this.nHidden , this.nOutput);

		this.cInput = makeMatrix (this.nInput , this.nHidden);
		this.cOutput = makeMatrix (this.nHidden , this.nOutput);
    }

	update(inputs){
		if (inputs.length != this.nInput-1){
			console.error("wrong number of inputs ");
			return "Erreur";
		}

		//input activations
		for (var i=0; i<this.nInput-1; i++) {
		    this.aInput[i]= inputs[i];
		}
        //console.log ("aInput",this.aInput);
        //console.log ("inputs",inputs);
        
		//hidden activations
		for (var j=0; j<this.nHidden; j++) {
			var sum = 0.0;
			for (var i=0; i<this.nInput; i++) {
				sum=sum +this.aInput[i]*this.wInput[i][j];
			}
			this.aHidden[j]= Math.tanh(sum);
		} 
        //console.log ("aHidden",this.aHidden);

        //console.log(this.aHidden[j]);
		//output activations
		for (var j=0; j<this.nOutput; j++) {
			var sum = 0.0;
			for (var i=0; i<this.nHidden; i++) {
				sum=sum +this.aHidden[i]*this.wOutput[i][j];
			}
            //console.log(sum)
			this.aOutput[j]= Math.tanh(sum)
		}

        //console.log(tabToString(this.aOutput));
		return this.aOutput; //? copi?
	}

	backPropagate(targets, N, M){
        if (targets.length != this.nOutput){
            console.error("wrong number of target values ");
			return "Erreur";
        }

        // calculate error terms for output
        var outputDeltas = (new Array (this.nOutput)).fill(0.0);
        for (var k=0; k<this.nOutput; k++) {
            var error = targets[k]-this.aOutput[k];
            outputDeltas[k] = DTanh(this.aOutput[k]) * error;
        }

        // calculate error terms for hidden
        var hiddenDeltas = (new Array (this.nHidden)).fill(0.0);
        for (var j=0; j<this.nHidden; j++) {
            var error = 0.0;
            for (var k=0; k<this.nOutput; k++) {
                error = error + outputDeltas[k]*this.wOutput[j][k];
            }
            hiddenDeltas[j] = DTanh(this.aHidden[j]) * error;
        }

        // update output weights
        for (var j=0; j<this.nHidden; j++) {
            for (var k=0; k<this.nOutput; k++) {
                var change = outputDeltas[k]*this.aHidden[j];
                this.wOutput[j][k] = this.wOutput[j][k] + N*change + M*this.cOutput[j][k];
                this.cOutput[j][k] = change;
            }
        }

        // update input weights
        for (var i=0; i<this.nInput; i++) {
            for (var j=0; j<this.nHidden; j++) {
                var change = hiddenDeltas[j]*this.aInput[i];
                this.wInput[i][j] = this.wInput[i][j] + N*change + M*this.cInput[i][j];
                this.cInput[i][j] = change;
            }
        }


        // calculate error
        var error = 0.0;
        for (var k=0; k<targets.length; k++) {
            error = error + 0.5* Math.pow(targets[k]-this.aOutput[k],2);
        }
        return error;
    }

    test( patterns){
        for (var p=0; p<patterns.length; p++) {
            //console.log(patterns[p]);
            console.log(tabToString(patterns[p][0]), '->', tabToString(this.update(patterns[p][0])));
        }
    }

    weights(){
        console.log ('Input weights:');
        for (var i=0; i<this.nInput; i++) {
            console.log( this.wInput[i]);
        }
        console.log ('Output weights:');
        for (var j=0; j<this.nHidden; j++) {
            console.log (this.wOutput[j])
        }
    }

    train(patterns, iterations=1000, N=0.5, M=0.1){
        // N: learning rate
        // M: momentum factor

        
        for (var i=0; i<iterations; i++){
            var error = 0.0;
            for (var p=0; p<patterns.length; p++) {
                var inputs = patterns[p][0];
                var targets = patterns[p][1];
                this.update(inputs);
                error = error + this.backPropagate(targets, N, M);
            }
            if (i % 100 == 0){
                console.log ("error ",error);
            }
        }
        
    }


    static demo(){

        // Teach network XOR function
        var pat = [
            [[0,0], [1]],
            [[0,1], [0]],
            [[1,0], [0]],
            [[1,1], [1]]
        ];
        //console.log(tabToString(pat));
        // create a network with two input, two hidden, and one output nodes
        var n =  new NeuralNetwork(2, 3, 1);
        // train it with some patterns
        n.train(pat);
        // test it
        n.test(pat);

    }
    
    output(pat) {
        // this.test([[pat]]);
        const r = this.update(pat);
        // console.log(r);
        const output = Math.round(r[0]*2)/2; // round to 0.5
        if(output<0 || output>1)  {
            // throw "output is negative or greater than 1";
            console.log("output is negative or greater than 1");
            // console.log("color : "+pat[0]+" output : "+output);
            return 0;
        }
        const specieIndex = output * (SPECIES.length-1);
        // const max = Math.max(...r);
        // const specieIndex = r.indexOf(max) 
        return specieIndex;
    }
}

function tabToString(tab){
    if (!Array.isArray(tab)){
        return "ERROR is not a Array";
    }
    var text=" [";
    for (var i=0; i<tab.length; i++){
        if (Array.isArray(tab[i])){
            text+= tabToString (tab[i]);
            
        }else{
            text+=tab[i];
            if(i!= tab.length-1 ){
            text+=",";
            }
        }
        
    }
    text+="] ";
    return text;
}

function DTanh(y){
    return 1.0-y*y;
}