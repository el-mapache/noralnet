const Neuron = (function() {
    const Squash = {
        LOGISTIC(activationValue) {
            // Not sure why Euler's constant is special
            // 1 / (1 + (2.718^-x))
            // I think the means that as connections increase, their impact on the activation
            // is reduced.  This might mean that different connection have
            // undue weight over the activation
            return 1.0 / (1.0 + Math.exp(-activationValue));
        },
        LOGISTIC_DERIVATIVE(squashedValue) {
            return squashedValue * (1 - squashedValue);
        },
        TANH: function (x, derivate) {
            // All the same as above
            if (derivate) return 1 - Math.pow(Math.tanh(x), 2);
            return Math.tanh(x);
        }
    }

    function neuron(value) {
        // Set the activation value if passed in, either init to random
        this.activation = value === undefined ? Math.random() - 0.5 : value;

        // The bias value for connections to this neuron
        this.bias = 0;

        // The connections for this neuron
        this.connections = {
            input: [],
            output: []
        }

        // Errors
        this.error = 0;

        // Set default squash function
        this.sigmoid = Squash.LOGISTIC;
        this.sigmoidDerivative = Squash.LOGISTIC_DERIVATIVE;
    }

    return neuron;
})();
