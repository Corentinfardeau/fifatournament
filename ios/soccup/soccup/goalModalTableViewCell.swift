//
//  goalModalTableViewCell.swift
//  soccup
//
//  Created by Corentin FARDEAU on 12/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class GoalModalTableViewCell: UITableViewCell {
    
    @IBOutlet weak var labelPlayerName: label!
    public func configure(#namePlayer: String) {
        self.labelPlayerName.text = namePlayer
    }
    
}
