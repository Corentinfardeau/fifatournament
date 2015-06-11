//
//  goalModalController.swift
//  soccup
//
//  Created by Maxime DAGUET on 11/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class goalModalController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        //println(players)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func closeGoalModal(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {});
    }

    var players:AnyObject!
}
