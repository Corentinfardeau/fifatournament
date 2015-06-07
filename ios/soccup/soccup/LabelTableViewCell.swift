//
//  LabelTableViewCell.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class LabelTableViewCell: UITableViewCell {
    
    
    @IBOutlet weak var label: UILabel!
    
    
    public func configure(#text: String) {
        label.text = text
        
    }
   
}

