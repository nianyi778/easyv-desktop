import { Component } from "react"

export default class Parent extends Component<{ id: number }> {
    constructor(props: { id: number } | Readonly<{ id: number }>) {
        super(props)
    }

    componentDidMount() {
        console.log(this.props.id, '---更新了')
    }

    componentWillUnmount() {
        console.log(this.props.id, '---卸载了')
    }
    render() {
        return <div>
            {this.props.id}
        </div>
    }
}