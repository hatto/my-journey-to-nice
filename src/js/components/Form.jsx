import React        from 'react';
import classNames   from 'classnames';
import FormActions  from '../actions/FormActions';
import FormStore    from '../stores/FormStore';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return FormStore.getFormState();
}

var Form = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        FormStore.addChangeListener(this._onChange);
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        FormStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores());
    },

    send: function() {
      let data = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        title: this.title.value,
        email: this.email.value,
        phone: this.phone.value
      };
      FormActions.submitForm(data);
    },

    showError(field) {
      var errorEl = null;
      if (this.state.errors[field]) {
        return (
          <p className="error">{ this.state.errors[field] }</p>
        );
      }
      return null;
    },

    showMessage() {
      if (Object.keys(this.state.result).length > 0) {
        let result = this.state.result,
            cls = classNames({
              'result-message': true,
              'result-message--valid': result.valid,
              'result-message--error': !result.valid
            })
            ;

        return (
            <div className="{ cls }">{ result.data.response }</div>
        );
      }

      return null;
    },

    render: function() {
        return (
            <div className="form">
                { this.showMessage() }
                <div>
                    <label><input type="radio" name="title" value="Madame" ref={(input) => { this.title = input; }} />Madame</label>
                    <label><input type="radio" name="title" value="Monsieur" ref={(input) => { this.title = input; }} />Monsieur</label>
                    { this.showError('title') }
                </div>

                <div>
                    <label><input type="text" name="firstName" ref={(input) => { this.firstName = input; }} />Prénom</label>
                    { this.showError('firstName') }
                </div>
                <div>
                    <label><input type="text" name="lastName" ref={(input) => { this.lastName = input; }} />Nom</label>
                    { this.showError('lastName') }
                </div>
                <div>
                    <label><input type="email" name="email" ref={(input) => { this.email = input; }} />Email</label>
                    { this.showError('email') }
                </div>
                <div>
                    <label><input type="phone" name="phone" ref={(input) => { this.phone = input; }} />Portable</label>
                    { this.showError('phone') }
                </div>
                <div>
                    <button onClick={this.send}>Envoyer</button>
                </div>
            </div>
        );
    }
});

module.exports = Form;
