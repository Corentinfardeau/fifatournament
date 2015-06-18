//
//  randomTeamCell.swift
//  soccup
//
//  Created by Corentin FARDEAU on 13/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class RandomTeamCell: UITableViewCell {
    
    
    @IBOutlet weak var textField: UITextField!
    @IBOutlet weak var view: UIView!
    
    public func configureRandomTeam(#text: String?, placeholder: String, color: String) -> UITextField{
        
        let imageName = "team-icon.png"
        textField.text = text
        textField.textColor = UIColor(hexString: color)
        var placeholder = NSAttributedString(string: placeholder, attributes: [NSForegroundColorAttributeName : UIColor(hexString: color, alpha : 0.8)!])
        textField.attributedPlaceholder = placeholder
        
        textField.leftViewMode = UITextFieldViewMode.Always
        let image = UIImage(named: imageName)
        let imageView = UIImageView(image: image!)
        imageView.image = imageView.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        imageView.tintColor = UIColor(hexString: color)
        
        imageView.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        
        textField.leftView = imageView
        view.addSubview(imageView)
        
        return textField
    }
    
    public func configureDisableTextField(#text: String?) -> UITextField{
        
        textField.text = text
        textField.enabled = false
        textField.leftView = UIView(frame: CGRectMake(0, 0, 15, self.textField.frame.height))
        textField.leftViewMode = UITextFieldViewMode.Always
        
        return textField
    }
    
}