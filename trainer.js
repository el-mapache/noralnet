/*
    An example utility class that trains the network against a set of input
    features and target values
*/
class Trainer {
    // trainingInputs: The initial input values the inform neuron activation
    // trainingOutputs: The ideal values to compare against the output layer
    constructor(trainingInputs, trainingOutputs) {
        // Set an input layer sized to a feature set
        const inputNeurons = Trainer.createNeuronArray(trainingInputs[0].length);
        this.inputLayer = new InputLayer(inputNeurons);

        // Set an output layer sized to a target value set
        const outputNeurons = Trainer.createNeuronArray(trainingOutputs[0].length);
        this.outputLayer = new OutputLayer(outputNeurons);

        // Set the inputs and outputs to pull from during training
        this.featureInputs = trainingInputs;
        this.targetOutputs = trainingOutputs;

        // An array to hold n-numbers of hidden layers
        this.hiddenLayers = [];
    }

    //// Add a new hidden layer
    addLayer(neuronCount) {
        const hiddenNeurons = Trainer.createNeuronArray(neuronCount);
        this.hiddenLayers.push(new Layer(hiddenNeurons));
    }

    run(interval) {
        let featureCount = 0,
            targetCount = 0;

        // Get our array of layers
        const layers = [ this.inputLayer, ...this.hiddenLayers, this.outputLayer ];

        // Create a new network to manage these layers
        const network = new Network(layers);

        // Get the input / output values we will iterate over
        const featureInputs = this.featureInputs;
        const targetOutputs = this.targetOutputs;

        // Start training
        function trainHard() {
            // Grab this iterations features
            const features = featureInputs[featureCount++ % featureInputs.length];

            // Grab this iterations ideal output
            const targets = targetOutputs[targetCount++ % targetOutputs.length];

            // Start feeding forward, resolving neuron activation values
            network.processInput(features);

            // Compare the output against the ideal and propagate adjustments
            // backwards
            network.learn(targets);

            // Visualize the neuron's and their activation
            View.clearNetwork();
            layers.forEach((layer, i) => View.displayLayer(layer, i));

            // Recursively train
            setTimeout(trainHard, interval);
        }

        // Start training, Mac!
        trainHard();
    }

    //// Create an array of neurons initialized to random activations
    // neuronCount: The amount of neurons to create
    static createNeuronArray(neuronCount) {
        const neurons = [];
        for (let i = 0; i < neuronCount; i++) {
            neurons.push(new Neuron())
        }
        return neurons;
    }
}
