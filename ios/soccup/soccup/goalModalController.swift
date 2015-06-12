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

        for i in 0..<playersID.count{
            self.api.getPlayer(playersID[i], completionHandler: {
                player, error in
                
                if let playerName:String = player["playerName"] as? String{
                    self.playersName.append(playerName)
                }

                dispatch_async(dispatch_get_main_queue(), {
                    self.playerTableView.reloadData()
                })
            })
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return playersID.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! GoalModalTableViewCell
        cell.configure(namePlayer: playersName[indexPath.row])
        return cell
    }
    
    @IBAction func closeGoalModal(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {});
    }
    
    @IBOutlet weak var playerTableView: UITableView!
    
    var playersID:[String]!
    let api = API()
    var playersName = [String]()
}
