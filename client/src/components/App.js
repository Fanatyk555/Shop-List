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
    const data = [e.target.value];
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
    const productsList = this.state.productsList.map((item, index)=>(
      <tr key={index}>
        <td>{item.value}</td>
        <td>{item.price}</td>
        <td>{item.calories}</td>    
        <td>{item.weight}</td>
        <td>{item.fat}</td>    
        <td>{item.carbohydrates}</td>
        <td>{item.protein}</td>    
      </tr>));
    const productsInputList = this.state.apiResponse.map((item, index)=>(
      <li key={index} onClick={this.handleProductToList=()=>{
        let array=this.state.productsList;
        array.push(item);
        this.setState({ productsList: array})
      }}>{item.value} {item.price}zł</li>
    ));
    let price=0, calories=0, weight=0, fat=0, carbohydrates=0, protein=0;
    const productsListSummary = this.state.productsList.map((item)=>
      <>
        {price+=item.price}
        {calories+=item.calories}
        {weight+=item.weight}
        {fat+=item.fat}
        {carbohydrates+=item.carbohydrates}
        {protein+=item.protein}
      </>);
    console.log(productsListSummary)
    console.log(price)
    
    return (
      <>
        <div className="container-fluid text-white">
          <div className="selectProduct">
            <input onChange={this.handleInputProduct} value={this.state.value}/>
            <ul className="inputDropList">{productsInputList}</ul>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <table className="table table-sm">
            <thead>
            <tr>
              <th scope="col">Nazwa</th>
              <th scope="col">Cena</th>
              <th scope="col">Waga</th>
              <th scope="col">Kalorie</th>
              <th scope="col">Tłuszcze</th>
              <th scope="col">Węglowodany</th>
              <th scope="col">Białko</th>
            </tr>
            </thead>
            <tbody>
              {productsList}
              <label>Podsumowanie:</label>
              <tr>
                <td></td>
                <td>{price}</td>
                <td>{calories}</td>    
                <td>{weight}</td>
                <td>{fat}</td>    
                <td>{carbohydrates}</td>
                <td>{protein}</td>    
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
}

export default App;