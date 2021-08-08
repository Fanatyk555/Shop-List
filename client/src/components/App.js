import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PieChart } from 'react-minimal-pie-chart';
import React from 'react';
import axios from 'axios';
const Search = (props) => {
  return(
    <div className="selectProduct">
    <label>Wyszukaj produkt:</label>
    <input onChange={props.handleInput} value={props.value}/>
    <ul className="inputDropList">{props.searchList}</ul>
  </div>
  )
}
const ProductList = (props) => {
  return(
    <div style={{overflowX: "auto"}}>
      <table className="table table-sm table-striped">
      {/* table-responsive */}
        <thead>
        <tr>
          <th scope="col" style={{backgroundColor: "#2eb8b8"}}>Nazwa</th>
          <th scope="col" style={{backgroundColor: "#2eb8b8"}}>Cena</th>
          <th scope="col" style={{backgroundColor: "#99cc00"}}>Waga netto</th>
          <th scope="col" style={{backgroundColor: "#99cc00"}}>Waga 1szt</th>
          <th scope="col" style={{backgroundColor: "#99cc00"}}>Waga</th>
          <th scope="col" style={{backgroundColor: "#e6e600"}}>Kalorie</th>
          <th scope="col" style={{backgroundColor: "#E38627"}}>Tłuszcze</th>
          <th scope="col" style={{backgroundColor: "#C13C37"}}>Węglowodany</th>
          <th scope="col" style={{backgroundColor: "#6A2135"}}>Białko</th>
          <th scope="col" style={{backgroundColor: "#333333"}}></th>
        </tr>
        </thead>
        <tbody>
          {props.productsList}
          <tr style={{backgroundColor: "#808080"}}>
            <td>Podsumowanie:</td>
            <td>{Math.round(props.price*1e2) / 1e2} zł</td>
            <td>{props.weight} g</td>    
            <td></td>    
            <td></td>    
            <td>{Math.round(props.calories*1e1) / 1e1} kcal</td>    
            <td>{Math.round(props.fat*1e1) / 1e1} g</td>    
            <td>{Math.round(props.carbohydrates*1e1) / 1e1} g</td>
            <td>{Math.round(props.protein*1e1) / 1e1} g</td>    
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
class App extends React.Component {
  state = {
    apiResponse: [],
    value: "",
    productsList: [],
    productsWeight: []
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
        <td style={{backgroundColor: "#2eb8b8"}}>{item.value}</td>
        <td style={{backgroundColor: "#2eb8b8"}}>{Math.round((((item.price/item.weight)*this.state.productsWeight[index]))* 1e2) / 1e2} zł</td>
        <td style={{backgroundColor: "#99cc00"}}>{item.weight} g</td>  
        <td style={{backgroundColor: "#99cc00"}}>{item.weight_1szt} g</td>  
        <td className="selectWeight" style={{backgroundColor: "#99cc00"}}><input type="number" value={this.state.productsWeight[index]} onChange={(e)=>{this.setState(({productsWeight}) => ({
          productsWeight: [...productsWeight.slice(0,index),[e.target.value],...productsWeight.slice(index+1)]}))}}/> g</td>  
        <td style={{backgroundColor: "#e6e600"}}>{Math.round((((item.calories/100)*this.state.productsWeight[index]))* 1e1) / 1e1} kcal</td>    
        <td style={{backgroundColor: "#E38627"}}>{Math.round((((item.fat/100)*this.state.productsWeight[index]))* 1e1) / 1e1} g</td>    
        <td style={{backgroundColor: "#C13C37"}}>{Math.round((((item.carbohydrates/100)*this.state.productsWeight[index]))* 1e1) / 1e1} g</td>
        <td style={{backgroundColor: "#6A2135"}}>{Math.round((((item.protein/100)*this.state.productsWeight[index]))* 1e1) / 1e1} g</td> 
        <td style={{backgroundColor: "#333333"}}><button onClick={(e)=>{this.setState(({productsWeight, productsList}) => ({
          productsWeight: [...productsWeight.slice(0,index),...productsWeight.slice(index+1)],
          productsList: [...productsList.slice(0,index),...productsList.slice(index+1)]}))}}>x</button></td>   
      </tr>));
    const searchProduct = this.state.apiResponse.map((item, index)=>(
      <li key={index} className="searchProduct" onClick={()=>{
        let productsList=this.state.productsList;
        productsList.push(item);
        let productsWeight=this.state.productsWeight;
        productsWeight.push([item.weight]);
        this.setState({ productsList: productsList, productsWeight: productsWeight})
      }}>{item.value} {item.price}zł</li>
    ));
    let price=0, weight=0, calories=0, fat=0, carbohydrates=0, protein=0;
    const Summary = this.state.productsList.map((item, index)=>
      <>
        {price+=Math.round((((item.price/item.weight)*this.state.productsWeight[index]))* 1e2) / 1e2}
        {weight+=item.weight}
        {/* {sumWeight+=(this.state.productsWeight[index])} zmienna w state jest stringiem */}
        {calories+=Math.round((((item.calories/100)*this.state.productsWeight[index]))* 1e1) / 1e1}
        {fat+=Math.round((((item.fat/100)*this.state.productsWeight[index]))* 1e1) / 1e1}
        {carbohydrates+=Math.round((((item.carbohydrates/100)*this.state.productsWeight[index]))* 1e1) / 1e1}
        {protein+=Math.round((((item.protein/100)*this.state.productsWeight[index]))* 1e1) / 1e1}
      </>);
    return (
      <>
        <div className="container-fluid text-dark">
          <Search handleInput={this.handleInputProduct} value={this.state.value} searchList={searchProduct}/>
          <br/>
          {this.state.productsList.length!==0?<>
            <ProductList 
              stateProductsList={this.state.productsList} 
              stateProductsWeight={this.state.productsWeight}
              productsList={productsList}
              calories={calories}
              fat={fat}
              carbohydrates={carbohydrates}
              protein={protein}
            />
            <PieChart
              data={[
                { title: 'Tłuszcze', value: Math.round(fat*1e1) / 1e1, color: '#E38627' },
                { title: 'Węglowodany', value: Math.round(carbohydrates*1e1) / 1e1, color: '#C13C37' },
                { title: 'Białko', value: Math.round(protein*1e1) / 1e1, color: '#6A2135' },
              ]}
              lineWidth={100}
              radius={20}
              center={[50,20]}
              label={({ dataEntry }) => dataEntry.title+": "+dataEntry.value+"g"}
              labelStyle={{ fontSize: "2.5px" }}
            />
          </>:null}
        </div>
      </>
    )
  }
}

export default App;