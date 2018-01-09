window.onload = function () {
    var vdom = VElement('div', { 'id': 'container' }, [
        VElement('h1', { style: 'color:red' }, ['simple virtual dom']),
        VElement('p', ['hello world']),
        VElement('ul', [VElement('li', ['item #1']), VElement('li', ['item #2'])])
    ]);
    var rootnode = vdom.render();
    //这里添加到真实dom中,添加到了body下
    document.body.appendChild(rootnode);
    var newVdom = VElement('div', { 'id': 'container' }, [
        VElement('h5', { style: 'color:red' }, ['simple virtual dom']),
        VElement('p', ['hello world 2018']),
        VElement('ul', [VElement('li', ['item #1']), VElement('li', ['item #2']), VElement('li', ['item #3'])])
    ]);

    var patches = diff(vdom, newVdom);
    console.log(JSON.stringify(patches));
    patch(rootnode, patches);
}
