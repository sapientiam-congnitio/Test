import React, { Component } from "react";
import { getCurrencies } from "../../Graphql/queries";
import client from "../../Graphql/apolloClient";
import { connect } from "react-redux";
import { sendCurrency } from "../../actions";
import { CurrencySelect } from "./styles/style-nav";
import { ReactComponent as DownArrow } from "./svg/down.svg";
import { ReactComponent as UpArrow } from "./svg/up.svg";

class Currency extends Component {
  constructor() {
    super();
    this.fetchCurrency = this.fetchCurrency.bind(this);
    this.state = {
      currencies: [],
      showModal: false,
    };
  }

  closeModal = () => {
    this.setState({ showModal: false });
    document.removeEventListener("click", this.closeModal);
  };

  componentDidMount() {
    this.fetchCurrency();
    document.addEventListener("click", this.closeModal);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.closeModal);
  }

  handleClick = (e) => {
    if (this.state.showModal) {
      this.closeModal();
      return;
    }
    this.setState({ showModal: true });
    e.stopPropagation();
    document.addEventListener("click", this.closeModal);
  };

  async fetchCurrency() {
    const result = await client.query({
      query: getCurrencies,
    });
    console.log(result.data)
    document.addEventListener("click", this.closeModal);
    this.setState({ currencies: result.data.currencies });
  }

  render() {
    const { sendCurrency, selected } = this.props;
    return (
      <CurrencySelect onClick={this.handleClick} active={this.state.showModal}>
        <span>
          {this.state.currencies.length ? this.state.currencies[selected].symbol:""}
          {this.state.showModal ? <UpArrow /> : <DownArrow />}
        </span>
        <div active={this.state.showModal} id="options">
          {this.state.showModal &&
            this.state.currencies.map((item, id) =>
            {
              console.log("hello", item, id)
              return (
                <span onClick={() => sendCurrency(id)} key={id}>
                  {item.symbol} {item.label}
                </span>
              )
            })
          }
        </div>
      </CurrencySelect>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  sendCurrency: (state) => dispatch(sendCurrency(state)),
});

const mapStateToProps = (state) => ({
  selected: state.cart.currency,
});

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
