/**
 * Created by Yarmaliuk Mikhail on 23.10.2017.
 *
 * @module MPWorkingDays
 */

/**
 * MPWorkingDays module
 *
 * @author Yarmaliuk Mikhail
 *
 * @param {MPWorkingDays||Object} app
 * @param {jQuery} $
 */
var MPWorkingDays = (function (app, $) {

    /**
     * Default settings
     *
     * @type {{fullDay: string, enableDinner: boolean}}
     */
    let defaultSettings = {};

    /**
     * Get input setting
     *
     * @param {jQuery} widget
     * @param {string} settingName
     *
     * @return {null|string|bool}
     */
    let getInputSetting = function (widget, settingName) {
        return settingName in (widget.data('MPWorkingDaysSettings') || {}) ? widget.data('MPWorkingDaysSettings')[settingName] : defaultSettings[settingName];
    };

    /**
     * Automatic filling of time
     *
     * @param {jQuery} input Current filling input
     *
     * @return {undefined}
     */
    let aDaysTime = function (input) {
        let widget = input.closest('.working-days'),
            currentOption = input.closest('.option'),
            inputSelector = '.' + (input.hasClass('time-work') ? 'time-work' : 'time-dinner') + '[data-autofill="1"]',
            aDays = widget.find(inputSelector);

        if (aDays.length) {
            let fillingOption = input.closest('.option'),
                value = input.val();

            $.each(fillingOption.nextAll('.option'), function (i, el) {
                let option = $(el),
                    input = option.find(inputSelector);

                if (input.length) {
                    input.val(value);
                    app.setInputValue(option);
                }
            })
        }
    };

    /**
     * Blur input autofill event
     *
     * @param {jQuery.Event} event
     *
     * @return {undefined}
     */
    let blurAutoFillInput = function (event) {
        let widget = $(event.target).closest('.working-days'),
            enableDinner = getInputSetting(widget, 'enableDinner');

        if (!AutoFill.state(widget, '.time-work').isEmpty()) {
            AutoFill.state(widget, '.time-work').disable();
        }

        if (enableDinner) {
            if (!AutoFill.state(widget, '.time-dinner').isEmpty()) {
                AutoFill.state(widget, '.time-dinner').disable();
            }
        }
    };

    /**
     * Toggle autofill input state
     *
     * @type {{state: state}}
     */
    let AutoFill = {
        state: function (widget, classType) {

            classType = classType !== undefined ? classType : '';

            return {
                enable: function () {
                    widget.find(classType + '[data-autofill="-1"]').attr('data-autofill', 1);
                },
                disable: function () {
                    widget.find(classType + '[data-autofill="1"]').attr('data-autofill', -1);
                },
                isEmpty: function () {
                    return widget.find(classType + '[data-autofill="1"]').filter(function () {
                        return !!this.value;
                    }).length === 0;
                },
            }
        },
    };

    /**
     * Add personal input settings
     *
     * @param {string} id
     * @param {Object} settings
     *
     * @return {undefined}
     */
    app.addInputSettings = function (id, settings) {
        $('#' + id).data('MPWorkingDaysSettings', settings);
    };

    /**
     * Set input value
     *
     * @param {jQuery} option
     * @param {bool} toggle
     *
     * @return {undefined}
     */
    app.setInputValue = function (option, toggle) {
        let widget = option.closest('.working-days'),
            status = option.hasClass('active');

        let fullDay = getInputSetting(widget, 'fullDay'),
            enableDinner = getInputSetting(widget, 'enableDinner');

        let inputW = option.find('input.time-work'),
            realInputW = option.find('.realW');

        let inputD = enableDinner ? option.find('input.time-dinner') : null,
            realInputD = enableDinner ? option.find('.realD') : null;

        if (toggle !== true) {
            if (!inputW.val().length && (!inputD || !inputD.val().length)) {
                option.add(inputW).add(inputD)
                    .addClass('inactive')
                    .removeClass('active');
            } else {
                option
                    .removeClass('inactive')
                    .addClass('active');

                inputW
                    .removeClass(!inputW.val().length ? 'active' : 'inactive')
                    .addClass(inputW.val().length ? 'active' : 'inactive');

                if (enableDinner) {
                    inputD
                        .removeClass(!inputD.val().length ? 'active' : 'inactive')
                        .addClass(inputD.val().length ? 'active' : 'inactive');
                }
            }

            realInputW.val(inputW.val());

            if (enableDinner) {
                realInputD.val(inputD.val());
            }
        } else {
            inputW.val(null);
            realInputW.val(status === true ? null : fullDay);

            if (enableDinner) {
                inputD.val(null);
                realInputD.val(status === true ? null : fullDay);
            }

            option
                .toggleClass('inactive')
                .toggleClass('active');

            inputW.add(inputD)
                .removeClass('active')
                .addClass('inactive');

            option.find('[data-autofill="1"]').attr('data-autofill', -1);
        }

        // Change placeholder
        if (status !== option.hasClass('active')) {
            let placeholder = inputW.attr('placeholder');

            inputW
                .attr('placeholder', inputW.data('placeholder'))
                .data('placeholder', placeholder);

            if (enableDinner) {
                let placeholder = inputD.attr('placeholder');

                inputD
                    .attr('placeholder', inputD.data('placeholder'))
                    .data('placeholder', placeholder);
            }
        }

        // Re enable autofill
        if (AutoFill.state(widget).isEmpty() && !widget.find('.option.active').length) {
            AutoFill.state(widget).enable();
        }
    };

    /**
     * Re Init module
     *
     * Example:
     * {'newId1': {fullDay: ''}, 'newId2': {settings...}} // Set settings only for NEW widgets. (for existing widget use addInputSettings method)
     * {'id': 'existId'} // Copy previos widget settings
     * @property {Object} settings
     *
     * @return {undefined}
     */
    app.reInit = function (settings) {

        let widgets = $('.working-days');

        $.each(widgets, function (i, el) {
            let widget = $(el),
                widgetId = widget.attr('id'),
                dayInputs = widget.find('.time-work, .time-dinner');

            // Apply settings for new widgets
            if (widget.data('MPWorkingDaysSettings') === undefined) {
                let widgetSettings = defaultSettings;

                if (widgetId in (settings || {})) {
                    let foundSettings = settings[widgetId];

                    if (typeof foundSettings === 'object') {
                        widgetSettings = foundSettings;
                    } else {
                        let prevoisWidgetSettings = $('#' + foundSettings).data('MPWorkingDaysSettings');

                        if (prevoisWidgetSettings !== undefined) {
                            widgetSettings = prevoisWidgetSettings;
                        }
                    }
                }

                app.addInputSettings(widgetId, widgetSettings);
            }

            // Handle inputs
            $.each(dayInputs, function (i, el) {
                let timeInput = $(el);

                // Remove inputmask
                timeInput.inputmask('remove');

                // Attach inputmask plugin
                timeInput.inputmask('01.29 - 01.29', {
                    placeholder: getInputSetting(widget, 'roundTheClock'),
                    //colorMask: true,
                    insertMode: false,
                    definitions: {
                        '0': {
                            validator: function (chrs, mask, pos) {
                                if (chrs < 0) {
                                    return false;
                                } else if (chrs > 2 && chrs < 10) {
                                    return {caret: pos + 3, pos: pos + 1};
                                }

                                let nextSymbol = mask.buffer[pos + 1] !== undefined ? mask.buffer[pos + 1] : null;

                                if (nextSymbol !== null) {
                                    if (chrs > 1 && nextSymbol > 4) {
                                        return false;
                                    }
                                }

                                return true;
                            },
                        },
                        '1': {
                            validator: function (chrs, mask, pos) {
                                if (mask.buffer[pos - 1]) {
                                    switch (mask.buffer[pos - 1]) {
                                        case '0':
                                        case '1':
                                            return chrs >= 0 && chrs <= 9;
                                            break;

                                        case '2':
                                            return chrs >= 0 && chrs <= 4;
                                            break;
                                    }
                                }

                                return false;
                            },
                        },
                        '2': {
                            validator: "[0-5]",
                            cardinality: 1,
                        },
                    },
                    onBeforeWrite: function (e, buffer, caretPos) {
                        if (e.keyCode === 8 || e.keyCode === 46) {
                            return {caret: caretPos - 1};
                        }
                    },
                });

                // Attach keyup event
                timeInput
                    .off('.MPWorkingDays')
                    .on('keyup.MPWorkingDays', function (e) {
                        if ((e.keyCode >= 46 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8 || e.keyCode === 13 || e.ctrlKey) {
                            let input = $(this);
                            option = input.closest('.option');

                            app.setInputValue(option);

                            aDaysTime(input);
                        }
                    });

                // Attach blur autofill event
                if (timeInput.data('autofill') !== undefined && timeInput.data('autofill')) {
                    timeInput
                        .off('blur', blurAutoFillInput)
                        .blur(blurAutoFillInput);
                }

                // Attach click event
                if (timeInput.hasClass('time-work')) {
                    timeInput
                        .closest('div.option')
                        .off('.MPWorkingDays')
                        .on('click.MPWorkingDays', function (e) {
                            if (e.target.nodeName === 'DIV') {
                                app.setInputValue($(this), true);
                            }
                        });
                }
            });
        });
    };

    /**
     * Init MPWorkingDays module
     *
     * @param {Object} options
     *
     * @return {undefined}
     */
    app.init = function (options) {

        defaultSettings = $.extend(defaultSettings, options);

        app.reInit();
    };

    return app;

}(MPWorkingDays || {}, jQuery));

/**
 * Yii2 client side required validator for working days
 *
 * @author Yarmaliuk Mikhail
 */
yii.validation.requiredWorkingDays = function (attribute, messages, options) {
    let widget = $(attribute.input).closest('.working-days');

    let isEmpty = widget.find('.realW, .realD').filter(function () {
        return !!this.value;
    }).length === 0;

    if (isEmpty) {
        yii.validation.addMessage(messages, options.requiredMessage);
    }
};