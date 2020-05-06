$(document).ready(function () {

    //Get and Validate Form
    function gatherInputs(form) {
        var children = Array.from($(form).children());
        children = children
            .map(child => $(child).find('.input'))
            .filter(child => child.length !== 0)
            .map(child => $(child).get(0));
        var formInputs = children;
        var isValid = validate(formInputs);
        return isValid;
    };

    function validate(inputs) {
        var requiredFields = {
            empty: "",
            standardLength: 10,
            emailValue: "artbyanc1@gmail.com",
            passwordValue: "artbyanc1",
        };
        var emailInputs = inputs
            .filter(input => $(input).attr('id') === 'email')
            .map(input => $(input).val() !== requiredFields.empty
                && $(input).val().length >= requiredFields.standardLength
                && $(input).val() === requiredFields.emailValue
            )
        var passwordInputs = inputs
            .filter(input => $(input).attr('id') === 'password')
            .map(input => $(input).val() !== requiredFields.empty
                && $(input).val() === requiredFields.passwordValue
            )
        var validatedInputs = [...emailInputs, ...passwordInputs];
        if (validatedInputs.includes(false))
            return false;
        else
            return true;
    }





    $('.button_submit_container').click(function (e) {
        var form = $('.Login_Admin_Container').get(0);
        var isValid = gatherInputs(form);
        console.log(isValid);
        if (!isValid)
            e.preventDefault();
    });
})