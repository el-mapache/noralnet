/*
    A connection manages the signal between two different neurons
    (usually in different layers).  The weight of connections are
    constantly adjusted to reduce activation error
*/
class Connection {
    constructor(from, to, weight) {
        // The left neuron
        this.from = from;
        // The right neuron
        this.to = to;
        // The amount to influence the activation of a neuron
        this.weight = weight;
    }
}
