
const adminModel = require('../models/adminModel')
const profileModel = require('../models/profileModel')


async function getUsers(req, res) {
  const email = req.session.user.email;
  console.log(email);
  try {
    // Get notification details by email using your model function
    const users = await adminModel.getUsers(email);
    const profile = await profileModel.getProfileImg(email);
    console.log(users);
    if (users === null) {
      // Handle the case where no notification data is found
      // You can render the page without that information or show a message
      res.render('users', { user: req.session.user, users: null, profile });
    } else {
      res.render('users', { user: req.session.user, users: users , profile});
    }
  } catch (error) {
    console.error('Error fetching notification data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getNotApprovedGigsAdmin(req, res) {
  
  try {
    // Get notification details by email using your model function
    const gigs = await adminModel.getNotApprovedGigs();
    const user = await profileModel.getProfile(req.session.user.email)
    const profile = await profileModel.getProfileImg(req.session.user.email);
    res.render('unapproved-gigs', { user: user, gigs: gigs, profile });
  }

  catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

// async function getDocumentsOfCampaign(req, res) {
//   const campaignId = req.params.campaignId;
//   console.log(campaignId);
//   try {
//     // Get notification details by email using your model function
//     const documents = await adminModel.getDocsById(campaignId);
//     console.log(documents);
//     if (documents === null) {
//       // Handle the case where no notification data is found
//       // You can render the page without that information or show a message
//       res.render('view-documents', { user: req.session.user, documents: null });
//     } else {
//       res.render('view-documents', { user: req.session.user, documents: documents });
//     }

//   } catch (error) {
//     console.error('Error fetching campaign data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// }
async function AddAdmin(req, res) {
  res.render('register-admin', { user: req.session.user });
}
async function getReportForm(req, res) {
  try {
    const gigId = req.params.gigId;
    res.render('report-form', { user: req.session.user, gigId });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getAcceptedReport(req, res) {
  res.render('accepted-report', { user: req.session.user });
}

async function getReportedGigs(req, res) {

  try {
    // Get notification details by email using your model function
    const reports = await adminModel.getNotApprovedReports();
    const user = await profileModel.getProfile(req.session.user.email)
    const profile = await profileModel.getProfileImg(req.session.user.email);
  
    res.render('reported-gigs', { user: user, reports, profile });
  }

  catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function viewGigReport(req, res) {
  const rid = req.params.rid;
  try {
    const reportId = rid;

    const report = await adminModel.getReportById(reportId);
    console.log(report);
    res.render('sent-report', { user: req.session.user, report });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getDeleteForm(req, res) {
  try {
    const gigId = req.params.gigId;
    res.render('delete-form', { user: req.session.user, gigId });
  }catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}


async function viewDeleteRequest(req, res) {
  const id = req.params.did;
  try {
    const deleteId = id;
    const request = await adminModel.getDeleteRequestById(deleteId);
    console.log(request);
    res.render('view-delete-reason', { user: req.session.user, request });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAllEditRequests(req, res) {
  try {

    const reports = await adminModel.selectEditRequests();
    const user = await profileModel.getProfile(req.session.user.email)
    const profile = await profileModel.getProfileImg(req.session.user.email);
    res.render('edit-requests', { user: user, reports, profile });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAllDeleteRequests(req, res) {
  try {
    const request = await adminModel.selectDeleteRequests();
    const user = await profileModel.getProfile(req.session.user.email)
    const profile = await profileModel.getProfileImg(req.session.user.email);
    res.render('delete-requests', { user: user, request, profile });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getUserBlockForm(req, res) {
  const userEmail = req.params.email;
  try {
    console.log(userEmail);
    res.render('block-user-form', { user: req.session.user, userEmail });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}



module.exports = {
  getUsers,
  getNotApprovedGigsAdmin,
  AddAdmin,
  getReportForm,
  getAcceptedReport,
  getReportedGigs,
  viewGigReport,
  getDeleteForm,
  viewDeleteRequest,
  getAllEditRequests,
  getAllDeleteRequests,
  getUserBlockForm
}