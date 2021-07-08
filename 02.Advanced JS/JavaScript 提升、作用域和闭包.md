理解 JavaScript 语言最重要和最基本的概念是<理解执行上下文>。

通过正确学习它，您将能够很好地学习更高级的主题，如提升、作用域链和闭包。

考虑到这一点，“执行上下文”究竟是什么？

为了更好地理解它，让我们先来看看我们是如何编写软件的。


编写软件的一种策略是将我们的代码分解成单独的部分。

尽管这些“部分”有许多不同的名称（函数、模块、包等），但它们的存在都是为了一个目的——分解和管理我们应用程序中的复杂性。


现在，从 JavaScript 引擎的角度思考，它的工作是解释代码。

我们是否可以使用相同的策略，将代码分成几部分，来管理解释代码的复杂性，就像我们为了编写它所做的那样？事实证明我们可以，这些“部分”被称为执行上下文。


就像函数/模块/包允许您管理编写代码的复杂性一样，执行上下文允许 JavaScript 引擎管理解释和运行代码的复杂性。

既然我们知道了执行上下文的目的，接下来我们需要回答的问题是它们是如何创建的以及它们由什么组成？

JavaScript 引擎运行您的代码时创建的第一个执行上下文称为“全局执行上下文”。
最初，这个执行上下文将由两部分组成 - 一个全局对象和一个名为this. this将引用全局对象，window如果您在浏览器中运行 JavaScript，或者global如果您在 Node 环境中运行它。


显示即使没有代码，全局执行上下文仍然为您创建一个 window 对象和一个 this 对象

上面我们可以看到，即使没有任何代码，全局执行上下文仍将包含两件事 -window和this. 这是最基本形式的全局执行上下文。


让我们更进一步，看看当我们开始向我们的程序实际添加代码时会发生什么。
让我们从添加几个变量开始。


创建阶段的全局变量

执行阶段的全局变量

你能发现上面两张图片之间的区别吗？关键是每个执行上下文都有两个独立的阶段，一个Creation阶段和一个Execution阶段，每个阶段都有自己独特的职责。


在全局Creation阶段，JavaScript 引擎将

创建一个全局对象。

创建一个名为“this”的对象。

为变量和函数设置内存空间。

在将任何函数声明放置在内存中时，为变量声明分配默认值“未定义”。

直到ExecutionJavaScript 引擎开始逐行运行您的代码并执行它的阶段。


我们可以在下面的 GIF 中看到这种从一个Creation阶段到Execution另一个阶段的流程。


动画 GIF 显示从创建阶段到执行阶段的流程

在Creation相，window和this创建，变量声明（name和handle）被分配的缺省值undefined，任何函数声明（getUser）置于完全到内存中。
然后一旦我们进入该Execution阶段，JavaScript 引擎就会开始逐行执行代码，并将实际值分配给已经存在于内存中的变量。


GIF 很酷，但不如单步执行代码并亲自查看过程那么酷。
因为你应得的，我专门为你创建了JavaScript Visualizer。
如果您想浏览上面的确切代码，请使用此链接。


要真正巩固这一想法的Creation阶段VSExecution阶段，让我们记录一些值后的Creation阶段和之前的Execution阶段。


console.log("name: ", name);
console.log("handle: ", handle);
console.log("getUser :", getUser);

var name = "Tyler";
var handle = "@tylermcginnis";

function getUser() {
  return {
    name: name,
    handle: handle,
  };
}
在上面的代码中，您希望将什么记录到控制台？当 JavaScript 引擎开始逐行执行我们的代码并调用我们的 console.logs 时，这个Creation阶段已经发生了。
这意味着，正如我们之前看到的，变量声明应该被赋值为 ，undefined而函数声明应该已经完全在内存中。
所以正如我们所期望的那样，name并且handle是undefined和getUser是对内存中函数的引用。


console.log("name: ", name); // name: undefined
console.log("handle: ", handle); // handle: undefined
console.log("getUser :", getUser); // getUser: ƒ getUser () {}

var name = "Tyler";
var handle = "@tylermcginnis";

function getUser() {
  return {
    name: name,
    handle: handle,
  };
}
undefined在创建阶段为变量声明分配默认值的过程称为提升。


希望你只是有一个'啊哈！” 片刻。
您之前可能已经向您解释过“提升”，但没有取得多大成功。
关于“提升”的令人困惑的事情是实际上没有任何东西被“提升”或移动。
既然您了解了执行上下文并且变量声明undefined在该Creation阶段被分配了一个默认值，那么您就了解了“提升”，因为这就是它的全部内容。


在这一点上，您应该对全局执行上下文及其两个阶段相当满意，Creation并且Execution. 好消息是您只需要学习另外一个执行上下文，它几乎与全局执行上下文完全相同。
它称为函数执行上下文，每当调用函数时都会创建它。


这是关键。
创建执行上下文的唯一时间是 JavaScript 引擎首次开始解释您的代码（全局执行上下文）以及调用函数时。


现在我们需要回答的主要问题是全局执行上下文和函数执行上下文之间有什么区别。
如果你还记得之前，我们说过在 GlobalCreation阶段，JavaScript 引擎会

创建一个全局对象。

创建一个名为“this”的对象。

为变量和函数设置内存空间。

在将任何函数声明放置在内存中时，为变量声明分配默认值“未定义”。

当我们谈论函数执行上下文时，哪些步骤没有意义？这是第 1 步。
我们应该只Creation在全局执行上下文阶段创建一个全局对象，而不是每次调用函数并且 JavaScript 引擎创建一个函数执行上下文时。
函数执行上下文需要担心全局执行上下文不是参数，而不是创建全局对象。
考虑到这一点，我们可以调整我们之前的列表。
每当创建函数执行上下文时，JavaScript 引擎都会

    1. 创建一个全局对象。

    1. 创建一个参数对象。

    2. 创建一个名为 this 的对象。

    3. 为变量和函数设置内存空间。

    4. 在内存中放置任何函数声明时，为变量声明分配一个默认值“undefined”。


为了看到它的实际效果，让我们回到之前的代码，但这次不仅仅是定义getUser，让我们看看调用它时会发生什么。


GIF 显示了在调用函数时如何创建新的执行上下文

自己可视化代码

正如我们所说的，当我们调用getUser一个新的执行上下文时，它被创建。
在执行上下文Creation阶段getUsers，JavaScript 引擎会创建一个this对象以及一个arguments对象。
因为getUser没有任何变量，JavaScript 引擎不需要设置任何内存空间或“提升”任何变量声明。


您可能还注意到，当getUser函数完成执行时，它会从可视化中删除。
实际上，JavaScript 引擎会创建所谓的“执行堆栈”（也称为“调用堆栈”）。
每当调用函数时，都会创建一个新的执行上下文并将其添加到执行堆栈中。
每当一个函数通过 theCreation和Executionphase完成运行时，它就会从执行堆栈中弹出。
因为 JavaScript 是单线程的（意味着一次只能执行一个任务），所以这很容易形象化。
使用“JavaScript Visualizer”，执行堆栈以嵌套方式显示，每个嵌套项都是执行堆栈上的新执行上下文。


显示 JavaScript 是如何单线程的，每次调用一个函数时，都会将一个新的执行上下文添加到执行堆栈中

自己可视化代码

在这一点上，我们已经看到函数调用如何创建自己的执行上下文，这些执行上下文被放置在执行堆栈上。
我们还没有看到的是局部变量如何发挥作用。
让我们修改我们的代码，让我们的函数有局部变量。


带有局部变量和参数的执行上下文

自己可视化代码

这里有几个重要的细节需要注意。
首先，您传入的任何参数都将作为局部变量添加到该函数的执行上下文中。
在示例中handle，它既作为Global执行上下文中的变量存在（因为它是在那里定义的）以及getURL执行上下文，因为我们将它作为参数传入。
其次是在函数内部声明的变量存在于该函数的执行上下文中。
因此，我们创建的时候twitterURL，它里面居住的的getURL执行上下文，因为这就是它的定义，不是在Global执行上下文。
这似乎很明显，但它是我们下一个主题范围的基础。


在过去，您可能听说过“范围可访问”的定义。
不管这在当时是否有意义，凭借您对执行上下文和 JavaScript Visualizer 工具的新知识，范围将比以往任何时候都更加清晰。
事实上，MDN 将“范围”定义为“当前执行的上下文”。
听起来有点熟？我们可以以与我们一直在考虑的执行上下文非常相似的方式来考虑“范围”或“变量可访问的位置”。


这里有一个测试给你。
会什么bar时候在下面代码的记录呢？

function foo() {
  var bar = "Declared in foo";
}

foo();

console.log(bar);
让我们在 JavaScript Visualizer 中查看一下。


将执行上下文从堆栈中移除后，如何可视化无法访问变量

自己可视化代码

当foo被调用时，我们在执行堆栈上创建一个新的执行上下文。
该Creation阶段创建this，arguments以及套bar到undefined。
然后Execution阶段发生并将字符串分配Declared in foo给bar。
之后Execution阶段结束，foo执行上下文从堆栈中弹出。
一旦foo从执行堆栈中删除，我们尝试登录bar到控制台。
在那一刻，根据 JavaScript Visualizer，就好像bar从来没有存在过，所以我们得到ReferenceError: bar is not defined. 这向我们展示了在函数内部创建的变量是局部作用域的。
这意味着（在大多数情况下，我们稍后会看到一个异常）一旦函数的执行上下文从执行堆栈中弹出，它们就不能被访问。


这是另一个。
代码执行完毕后，控制台会记录什么？

function first() {
  var name = "Jordyn";

  console.log(name);
}

function second() {
  var name = "Jake";

  console.log(name);
}

console.log(name);
var name = "Tyler";
first();
second();
console.log(name);
再次，让我们看看 JavaScript Visualizer。


可视化每个范围如何拥有自己独特的变量环境

自己可视化代码

我们得到undefined, Jordyn, Jake, Tyler。
这向我们展示的是，您可以将每个新的执行上下文视为具有自己独特的变量环境。
即使还有其他包含变量的执行上下文，nameJavaScript 引擎也会首先查看该变量的当前执行上下文。


这就提出了一个问题，如果当前执行上下文中不存在该变量怎么办？JavaScript 引擎会停止寻找该变量吗？让我们看一个可以回答这个问题的例子。
在下面的代码中，将记录什么？

var name = "Tyler";

function logName() {
  console.log(name);
}

logName();
可视化如果执行上下文找不到变量，它将如何查看其所有父执行上下文

自己可视化代码

您的直觉可能是它会记录日志，undefined因为logName执行上下文name在其范围内没有变量。
这是公平的，但这是错误的。
发生的情况是，如果 JavaScript 引擎找不到函数执行上下文的局部变量，它将查找该变量的最近父执行上下文。
这个查找链将一直持续到引擎到达全局执行上下文。
在这种情况下，如果全局执行上下文没有该变量，它将抛出一个引用错误。


如果本地执行上下文中不存在变量，JavaScript 引擎会一个接一个地检查每个单独的父执行上下文，这个过程称为Scope Chain. JavaScript Visualizer 通过缩进每个新的执行上下文并使用独特的彩色背景来显示作用域链。
从视觉上可以看出，任何子执行上下文都可以引用位于其任何父执行上下文中的任何变量，但反之则不然。


早些时候我们了解到，在函数内部创建的变量是局部范围的，一旦函数的执行上下文从执行堆栈中弹出，它们就不能（在大多数情况下）被访问。
是时候深入研究“大部分”了。
一种情况不是这样，如果您有一个函数嵌套在另一个函数中。
在这种情况下，子函数仍然可以访问外部函数的作用域，即使父函数的执行上下文已从执行堆栈中移除。
那是很多话。
一如既往，JavaScript Visualizer 可以帮助我们。


可视化闭包

自己可视化代码

请注意，在makeAdder执行上下文从执行堆栈中弹出后，JavaScript Visualizer 会创建所谓的Closure Scope. 其内部Closure Scope是存在于makeAdder执行上下文中的相同变量环境。
发生这种情况的原因是我们有一个函数嵌套在另一个函数中。
在我们的示例中，inner函数嵌套在函数内部makeAdder，因此inner创建了一个ClosureovermakeAdder变量环境。
即使在makeAdder执行环境从执行堆栈中弹出后，因为它Closure Scope已被创建，inner也可以访问x变量（通过作用域链）。


正如您可能已经猜到的那样，子函数“关闭”其父函数的变量环境的概念称为Closures。


奖金部分
这里有一些我知道的更多相关主题，如果我不提及，有人会打电话给我🙈。


全局变量
在浏览器中，无论何时您在全局执行上下文中（在任何函数之外）创建变量，该变量都将作为window对象的属性添加。


在这两种浏览器和节点，如果你创建了一个变量没有一个声明（即无var，let或const），该变量也将被添加为全局对象上的属性。


// In the browser
var name = "Tyler";

function foo() {
  bar = "Created in foo without declaration";
}

foo();

console.log(window.name); // Tyler
console.log(window.bar); // Created in foo without declaration
让和常量
let和constvar 的行为有点不同。
查看“JavaScript 中的 var vs let vs const”了解更多信息。


this 关键字
在本文中，我们了解到在Creation每个执行上下文阶段，JavaScript 引擎都会创建一个名为this. 如果您想了解更多关于为什么这很重要以及如何确定this关键字是什么，我建议您阅读WTF is this - 了解 JavaScript 中的 this 关键字、调用、应用和绑定