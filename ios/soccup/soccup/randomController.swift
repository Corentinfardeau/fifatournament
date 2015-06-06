//
//  randomController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    let localStorage = NSUserDefaults.standardUserDefaults()
    let api = API()
    var nbPlayers:Int!
    
    @IBAction func shuffleButton(sender: AnyObject) {
        let alert = UIAlertView()
        alert.message = "Les joueurs n'ont tous été remplit. "
        alert.addButtonWithTitle("OK")
        alert.show()
        return
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return nbPlayers
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        cell.configure(text: "", placeholder: "Nom du joueur \(indexPath.row+1)")
        return cell
    }
    
}
