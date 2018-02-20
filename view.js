class View {
    static clearNetwork() {
        document.getElementById('body').innerHTML = '';
    }
    
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

            let color;
            if (neuron.activation < 0) {
                color = parseInt(Math.abs(neuron.activation) * 255).toString(16);
                if (color.length === 1) color = '0' + color;
                el.style.backgroundColor = '#' + '00' + '00' + color;
            } else {
                color = parseInt(Math.abs(neuron.activation) * 255).toString(16);
                if (color.length === 1) color = '0' + color;
                el.style.backgroundColor = '#' + color + '00' + '00';
            }

            body.appendChild(el);
        })
    }
}
