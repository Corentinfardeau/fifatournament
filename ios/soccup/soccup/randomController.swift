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
    var arrayTextField = [UITextField]()
    
    @IBAction func shuffleButton(sender: AnyObject) {
        
        for index in 0...arrayTextField.count-1{
            
            if(arrayTextField[index].text != ""){
                println("ok")
            }else{
                let alert = UIAlertView()
                alert.message = "Les joueurs n'ont tous été remplit. "
                alert.addButtonWithTitle("OK")
                alert.show()
                break
            }
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return nbPlayers
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        var textField:UITextField = cell.configure(text: "", placeholder: "Nom du joueur \(indexPath.row+1)")
        arrayTextField.append(textField)
        return cell
    }
}
