<?php

class Application_Form_News extends Zend_Form {

//    public function init() {
//        /* Form Elements & Other Definitions Here ... */
//    }

    public function __construct($options = null) {
        parent::__construct($options);
        $this->setName('news');

        $id_news = new Zend_Form_Element_Hidden('id_news');
        $id_news->addFilter('Int');

        $header = new Zend_Form_Element_Text('header');
        $header->setLabel('Заголовок')
                ->setRequired(true)
                ->addFilter('StripTags')
                ->addFilter('StringTrim')
                ->addValidator('NotEmpty');
        
        $anons = new Zend_Form_Element_Textarea('anons');
        $anons->setLabel('Анонс')
                ->setRequired(true)
                ->addFilter('StripTags')
                ->addFilter('StringTrim')
                ->addValidator('NotEmpty');
        
        $context = new Zend_Form_Element_Textarea('context', array('placeholder' => 'Основной текст'));
        $context->setLabel('Основной текст')
                ->setRequired(true)
                ->addFilter('StripTags')
                ->addFilter('StringTrim')
                ->addValidator('NotEmpty');
        
        $posted = new Zend_Form_Element_Checkbox('posted', array('use_hidden_element' => true, 'checked_value' => true, 'unchecked_value' => false));
        $posted ->setLabel("Опубликован")
                ->setRequired(true);

        $submit = new Zend_Form_Element_Submit('submit');
        $submit->setAttrib('id_news', 'submitbutton');

        $this->addElements(array($id_news, $header, $anons, $context, $posted, $submit));
    }

}
