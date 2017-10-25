<?php
/**
 * Created by PhpStorm.
 * User: Yarmaliuk Mikhail
 * Date: 25.10.2017
 * Time: 12:55
 */

namespace MP\WorkingDateTime;

use Yii;
use yii\helpers\Html;
use yii\validators\ValidationAsset;
use yii\validators\Validator;

/**
 * Class    WorkingDaysRequiredValidator
 * @package MP\WorkingDateTime
 * @author  Yarmaliuk Mikhail
 * @version 1.0
 */
class WorkingDaysRequiredValidator extends Validator
{
    /**
     * Reuired error message
     *
     * @var string
     */
    public $message = NULL;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        if ($this->message === NULL) {
            $this->message = Yii::t('yii', '{attribute} cannot be blank.');
        }
    }

    /**
     * @inheritdoc
     */
    protected function validateValue($value)
    {
        if (is_array($value)) {
            $empty = true;

            foreach ($value as $dayAlias => $workTimes) {
                if (!empty($workTimes['work']) || !empty($workTimes['dinner'])) {
                    $empty = false;
                    break;
                }
            }

            if ($empty) {
                return [$this->message, []];
            }
        } else {
            return [$this->message, []];
        }

        return NULL;
    }

    /**
     * @inheritdoc
     */
    public function clientValidateAttribute($model, $attribute, $view)
    {
        ValidationAsset::register($view);

        $options = $this->getClientOptions($model, $attribute);

        return 'yii.validation.requiredWorkingDays(attribute, messages, ' . json_encode($options, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ');';
    }

    /**
     * @inheritdoc
     */
    public function getClientOptions($model, $attribute)
    {
        $options = [];

        $options['inputName']       = Html::getInputName($model, $attribute);
        $options['requiredMessage'] = $this->formatMessage($this->message, [
            'attribute' => $model->getAttributeLabel($attribute),
        ]);

        return $options;
    }
}