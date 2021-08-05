import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {
    apiResponse: [],
    value: "",
    productsList: []
  }
  componentDidMount(){
    setInterval(() => {
    }, 1000);
  }
  handleInputProduct = (e) => {
    this.setState({ value: e.target.value})
    const data = [this.state.value];
    axios
      .post('http://192.168.0.2:9000/selectProduct', data)
      .catch(err => console.error(err));
    setTimeout(() => {
      fetch('http://192.168.0.2:9000/selectProduct')
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
    }, 300);
  }
  render() {
    const productsList = this.state.productsList.map((item, index)=><li key={index}>{item}</li>);
    const productsInputList = this.state.apiResponse.map((item, index)=>(
      <li key={index} onClick={this.handleProductToList=()=>{
        let array=this.state.productsList;
        array.push(item.value+' '+item.price);
        this.setState({ productsList: array})
      }}>{item.value} {item.price}zł</li>
    ));
    return (
      <>
        <div className="container-fluid text-white">
          <div className="selectProduct">
            <input onChange={this.handleInputProduct} value={this.state.value}/>
            <ul className="inputDropList">{productsInputList}</ul>
            <br/>
            <br/>
            <br/>
            <br/>
            <ul>{productsList}</ul>
          </div>
        </div>
      </>
    )
  }
}

export default App;