/*
    An example utility class that trains the network against a set of input
    features and target values
*/
class Trainer {
    // trainingInputs: The initial input values the inform neuron activation
    // trainingOutputs: The ideal values to compare against the output layer
    constructor(inputLength, outputLength) {
        // Set an input layer sized to a feature set
        const inputNeurons = Trainer.createNeuronArray(inputLength);
        this.inputLayer = new InputLayer(inputNeurons);

        // Set an output layer sized to a target value set
        const outputNeurons = Trainer.createNeuronArray(outputLength);
        this.outputLayer = new OutputLayer(outputNeurons);

        // Counters to roll over when moving over data
        this.featureCount = 0;
        this.targetCount = 0;

        // An array to hold n-numbers of hidden layers
        this.hiddenLayers = [];
    }

    //// Add a new hidden layer
    addLayer(neuronCount) {
        const hiddenNeurons = Trainer.createNeuronArray(neuronCount);
        this.hiddenLayers.push(new Layer(hiddenNeurons));
    }

    //// Put the inputs through the system and evaluate against the outputs
    train(features, targets) {
        // Start feeding forward, resolving neuron activation values
        this.network.processInput(features);

        // Compare the output against the ideal and propagate adjustments backwards
        this.network.learn(targets);
    }

    createNetwork() {
        // Get our array of layers
        const layers = [ this.inputLayer, ...this.hiddenLayers, this.outputLayer ];

        this.network = new Network(layers)
    }

    //// Start the uninterruptable training process
    // interval: The delay between training sessions (and visualization)
    // initial (optional): A set of trainings to do without visualization (fast)
    run(feature, target) {
        let featureCount = 0,
            targetCount = 0;

        // Get our array of layers
        const layers = [ this.inputLayer, ...this.hiddenLayers, this.outputLayer ];

        this.train(feature, target);

        // Visualize the neuron's and their activation
        View.clearNetwork();
        layers.forEach((layer, i) => View.displayLayer(layer, i));
    }

    predict(features) {
        this.network.processInput(features);

        const outputs = [];
        this.network.outputLayer.neurons.forEach((neuron) => {
            outputs.push(neuron.activation);
        })

        console.log(outputs);
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
