const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

subscription_id:{
type:String,
required:true
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

plan:{
type:String,
enum:["free","pro"],
required:true
},

price:{
type:Number
},

start_date:{
type:Date,
required:true
},

end_date:{
type:Date
},

status:{
type:String,
enum:["active","expired"],
default:"active"
}

});

module.exports = mongoose.model("UserSubscription", subscriptionSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user subscription lookup
subscriptionSchema.index({ user_id:1 });

// Index for subscription plan queries
subscriptionSchema.index({ plan:1 });

// Index for subscription status filtering
subscriptionSchema.index({ status:1 });

// Index for subscription start date sorting
subscriptionSchema.index({ start_date:-1 });

// Index for subscription end date checks
subscriptionSchema.index({ end_date:1 });

// Compound index for user + status queries
subscriptionSchema.index({ user_id:1, status:1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only active subscriptions
subscriptionSchema.index(
{ status:1 },
{ partialFilterExpression:{ status:"active" } }
);

// Index subscriptions where price exists
subscriptionSchema.index(
{ price:1 },
{ partialFilterExpression:{ price:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get subscription by user
subscriptionSchema.statics.getSubscriptionByUser = function(userId){
return this.findOne({ user_id:userId });
};

// Get active subscriptions
subscriptionSchema.statics.getActiveSubscriptions = function(){
return this.find({ status:"active" });
};

// Expire a subscription
subscriptionSchema.statics.expireSubscription = function(subscriptionId){
return this.findOneAndUpdate(
{ subscription_id:subscriptionId },
{ status:"expired", end_date:new Date() },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: subscriptions per plan
subscriptionSchema.statics.subscriptionsPerPlanView = function(){
return this.aggregate([
{
$group:{
_id:"$plan",
total_subscriptions:{ $sum:1 }
}
},
{
$sort:{ total_subscriptions:-1 }
}
]);
};

// View: active subscription revenue
subscriptionSchema.statics.activeSubscriptionRevenueView = function(){
return this.aggregate([
{
$match:{ status:"active" }
},
{
$group:{
_id:null,
total_revenue:{ $sum:"$price" }
}
}
]);
};