class Neuron {
    constructor(value) {
        // Set the activation value if passed in, either init to random
        this.activation = value === undefined ? Math.random() - 0.5 : value;

        // The bias value for connections to this neuron
        this.bias = 0;

        // The connections for this neuron
        this.connections = {
            input: [],
            output: []
        }

        // How far we are from our ideal value
        this.error = 0;
    }
};
