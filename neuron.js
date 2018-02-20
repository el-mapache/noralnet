const Neuron = (function() {
    const Squash = {
        LOGISTIC: function(x, derivate) {
            // Not sure why Euler's constant is special
            // 1 / (1 + (2.718^-x))
            // I think the means that as connections increase, their impact on the activation
            // is reduced.  This might mean that different connection have
            // undue weight over the activation
            const fx = 1 / (1 + Math.exp(-x));

            // Not sure what this means, maybe this is to produce the adustment?
            // or to handle the calculation with only positive values?
            if (!derivate) return fx;

            // This shifts the bounds from 0 - 2 to -1 - 1
            return fx * (1 - fx);
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
        this.squash = Squash.TANH;
    }

    return neuron;
})();
