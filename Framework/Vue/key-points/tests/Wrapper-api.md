### interface Wrapper<V extends Vue | null> extends BaseWrapper {}

Wrapper实例调用
* properties
  {
    vm // 该 Vue 实例

    element

    options

    selector

  }

* methods
  {
    attributes(key?: string): {[attribute: string]: any} | 'string'

    classes(className?: string): Array<string> | boolean

    <!-- contains(selector: {string|Component}): boolean -->

    destroy()

    emitted(): { [name: string]: Array<Array<any>> }

    emittedByOrder()

    <!-- emittedByOrder(): Array<{ name: string, args: Array<any> }> -->

    exists(): boolean

    <!-- find(selector: string): Wrapper -->
    <!-- findAll(selector: string|Component): WrapperArray -->
    
    findComponent(selector: Component|ref|name): Wrapper

    findAllComponents(selector: Component|ref|name): WrapperArray

    html(): string

    isVisible(): boolean

    props(key: string): {[prop: string]: any} | any  (propsData: {})

    setChecked(checked? = true)

    setData(data: Object)
    setProps(props: Object)

    setSelected() // Selects an option element and updates v-model bound data.

    setValue(value: any) // Sets value of a input or select element and updates v-model bound data.

    text(): string

    trigger(eventName: string[, options?: Object])

  }
