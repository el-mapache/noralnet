const Connection = (function() {
    function connection(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    return connection;
})();
