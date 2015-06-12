//
//  TextInputTableViewCell.swift
//  soccup
//
//  Created by Maxime DAGUET on 05/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class TextInputTableViewCell: UITableViewCell {
    
    @IBOutlet weak var textField: UITextField!
    
    public func configure(#text: String?, placeholder: String) -> UITextField{
        textField.text = text
        textField.placeholder = placeholder
        
        textField.accessibilityValue = text
        textField.accessibilityLabel = placeholder
        
        //textField.layer.borderColor = UIColor(red:0.936, green:0.943, blue:0.978, alpha:1).CGColor
        //textField.layer.borderWidth = 1.0
        //textField.layer.cornerRadius = 25.0
        
        textField.leftView = UIView(frame: CGRectMake(0, 0, 15, self.textField.frame.height))
        textField.leftViewMode = UITextFieldViewMode.Always
        
        return textField
    }
}

