class View {
    static displayLayer(layer, index) {
        const verticalOffset = 5;
        const horizontalOffset = 5;
        const spacing = 20;
        const dimensions = { height: 20, width: 20 };

        layer.neurons.forEach((neuron, i) => {
            const body = document.getElementById('body');
            const el = document.createElement('div');

            el.style.position = 'absolute';
            el.style.width = dimensions.width + 'px';
            el.style.height = dimensions.height + 'px';
            el.style.top = ((spacing + dimensions.height) * i + verticalOffset) + 'px';
            el.style.left = ((spacing + dimensions.width) * index + horizontalOffset) + 'px';

            const color = parseInt((1 + neuron.activation) * 255).toString(16);
            el.style.backgroundColor = '#' + color + color + color;

            body.appendChild(el);
        })
    }
}
