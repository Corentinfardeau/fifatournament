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
        return textField
    }
}

