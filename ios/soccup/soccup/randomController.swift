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
        
        api.getTournament(tournamentID, completionHandler: {
            result, error in
            self.tournament = result
        })
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    let api = API()
    var tournamentID:String!
    var nbPlayers:Int!
    var tournament = Dictionary<String, AnyObject>()
    var playersName = [String]()
    var arrayTextField = [UITextField]()
    var verif:Bool = true
    
    @IBAction func shuffleButton(sender: AnyObject) {
        
        for index in 0...arrayTextField.count-1{
            if(arrayTextField[index].text != ""){
                playersName.append(arrayTextField[index].text)
            }else{
                verif = false
                let alert = UIAlertView()
                alert.message = "Les joueurs n'ont tous été remplit. "
                alert.addButtonWithTitle("OK")
                alert.show()
                break
            }
        }
        
        if(verif){
            createPlayers()
        }
    }
    
    func createPlayers(){
        api.createPlayers(tournamentID, players: playersName, completionHandler: {
            result, error in
            println(result)
        })
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
