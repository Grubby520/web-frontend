一、Get与Post区别
  Get和Post都是Http协议的组件，所以底层都是使用tcp链接。Get的请求方式是将http的header和data一并发往服务端，也就是一条tcp数据包发送，这就会有两个问题：

数据量有限，依赖于Tcp负载能力，所以携带的数据量很大的情况下，容易造成重发。
所有的携带的数据只能接受转化成ASCII字符。
  但是Post不一样，post使用两步走，先发送http的header，然后再传输data。数据类型也不受限制。而且数据隐秘性比较好。

二、Get方式参数获取
  get请求方式参数是拼接在url后，所以限制了可以发送的长度。Get不支持使用http Body获取参数，他只支持params，也就是URL拼接参数

