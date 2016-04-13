using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace PWApplication.Service
{
    public class SubscribtionHub : Hub
    {
        public void Subscribe(string userId)
        {
            Groups.Add(Context.ConnectionId, userId);
        }

        public void Unsubscribe(string userId)
        {
            Groups.Remove(Context.ConnectionId, userId);
        }
    }
}