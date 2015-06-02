//
//  configController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 29/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class configController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBOutlet weak var labelNbPlayers: UILabel!
    @IBOutlet weak var labelNbPlayersByTeam: UILabel!
    var random:Bool = false
    
    @IBAction func stepperNbPlayers(sender: UIStepper) {
        labelNbPlayers.text = Int(sender.value).description
    }
    
    
    @IBAction func stepperNbPlayersByTeam(sender: UIStepper) {
        labelNbPlayersByTeam.text = Int(sender.value).description
    }
    
    @IBAction func switchRandom(sender: UISwitch) {
        random = sender.on
    }
    
    @IBAction func saveConfig(sender: AnyObject) {
        
        transition(random)
    }
    
    func transition(random: Bool) {
        
        if(self.random){
            self.performSegueWithIdentifier("GoToRandomController", sender:self)
        }else{
            self.performSegueWithIdentifier("GoToReadyController", sender:self)
        }
    }
}
