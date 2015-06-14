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
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return players.count
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        self.api.getPlayer(players[indexPath.row]["_id"] as! String, completionHandler: {
            player, error in
            
            var nbGoal:Int = player["nbGoal"] as! Int
            
            var params = [
                "nbGoal" : nbGoal+1
            ]
            
            self.api.updatedPlayer(self.players[indexPath.row]["_id"] as! String, params: params, completionHandler: {
                player, error in
                self.closePopup()

            })
        })
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! GoalModalTableViewCell
        cell.configure(namePlayer: players[indexPath.row]["playerName"] as! String)
        return cell
    }
    
    @IBAction func closeGoalModal(sender: AnyObject) {
        sendData(false)
        self.dismissViewControllerAnimated(true, completion: {});
    }

    func closePopup(){
        self.sendData(true)
        self.dismissViewControllerAnimated(true, completion: {});
    }
    
    @IBOutlet weak var playerTableView: UITableView!
    
    let api = API()
    var players:[Dictionary<String, AnyObject>]!
    
    var onDataAvailable : ((data: Bool) -> ())?
    
    func sendData(data: Bool) {
        self.onDataAvailable?(data: data)
    }
}
