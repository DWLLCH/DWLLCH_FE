import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileFrame from './components/MobileFrame';
import OnboardingProvider from './components/OnboardingProvider';
import DocumentChecklistProvider from './components/DocumentChecklistProvider';
import BookmarkProvider from './components/BookmarkProvider';
import MyInfoProvider from './components/MyInfoProvider';
import NotificationProvider from './components/NotificationProvider';
import ChatbotProvider from './components/ChatbotProvider';
import AvatarProvider from './components/AvatarProvider';
import ApplicationProvider from './components/ApplicationProvider';
import BlockProvider from './components/BlockProvider';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignUpComplete from './pages/SignUpComplete';
import Onboarding1 from './pages/Onboarding1';
import Onboarding2 from './pages/Onboarding2';
import Onboarding3 from './pages/Onboarding3';
import Onboarding4 from './pages/Onboarding4';
import Onboarding5 from './pages/Onboarding5';
import Onboarding6 from './pages/Onboarding6';
import Onboarding7 from './pages/Onboarding7';
import Onboarding8 from './pages/Onboarding8';
import Onboarding9 from './pages/Onboarding9';
import Onboarding10 from './pages/Onboarding10';
import Onboarding11 from './pages/Onboarding11';
import OnboardingComplete from './pages/OnboardingComplete';
import Home from './pages/Home';
import Community from './pages/Community';
import WritePost from './pages/WritePost';
import PostDetail from './pages/PostDetail';
import SupportList from './pages/SupportList';
import PolicyDetail from './pages/PolicyDetail';
import ThemeView from './pages/ThemeView';
import DocumentGuide from './pages/DocumentGuide';
import MyInfoView from './pages/MyInfoView';
import MyInfoEdit from './pages/MyInfoEdit';
import Bookmark from './pages/Bookmark';
import Briefing from './pages/Briefing';
import BriefingDetail from './pages/BriefingDetail';
import MyPage from './pages/MyPage';
import PasswordChange from './pages/PasswordChange';
import EmailChange from './pages/EmailChange';
import IdChange from './pages/IdChange';
import AccountWithdraw from './pages/AccountWithdraw';
import Inquiry from './pages/Inquiry';
import InquiryDetail from './pages/InquiryDetail';
import TermsList from './pages/TermsList';
import VersionInfo from './pages/VersionInfo';
import NotificationList from './pages/NotificationList';
import MyPosts from './pages/MyPosts';
import MyComments from './pages/MyComments';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<MobileFrame />}>
          <Route element={<BookmarkProvider />}>
            <Route element={<NotificationProvider />}>
              <Route element={<AvatarProvider />}>
                <Route element={<ApplicationProvider />}>
                  <Route element={<BlockProvider />}>
                    <Route element={<ChatbotProvider />}>
                      <Route path="/" element={<Splash />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/signup/complete" element={<SignUpComplete />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/community/write" element={<WritePost />} />
                      <Route path="/community/:id/edit" element={<WritePost />} />
                      <Route path="/community/:id" element={<PostDetail />} />
                      <Route path="/support/list" element={<SupportList />} />
                      <Route path="/theme" element={<ThemeView />} />
                      <Route path="/chatbot" element={<Chatbot />} />
                      <Route element={<DocumentChecklistProvider />}>
                        <Route path="/support/:id" element={<PolicyDetail />} />
                        <Route path="/support/:id/documents" element={<DocumentGuide />} />
                      </Route>
                      <Route path="/bookmark" element={<Bookmark />} />
                      <Route path="/ai-briefing" element={<Briefing />} />
                      <Route path="/ai-briefing/:sectionId/:cardId" element={<BriefingDetail />} />
                      <Route path="/mypage" element={<MyPage />} />
                      <Route path="/mypage/notifications" element={<NotificationList />} />
                      <Route path="/mypage/password" element={<PasswordChange />} />
                      <Route path="/mypage/email" element={<EmailChange />} />
                      <Route path="/mypage/id" element={<IdChange />} />
                      <Route path="/mypage/withdraw" element={<AccountWithdraw />} />
                      <Route path="/mypage/inquiry" element={<Inquiry />} />
                      <Route path="/mypage/inquiry/:type" element={<InquiryDetail />} />
                      <Route path="/mypage/terms" element={<TermsList />} />
                      <Route path="/mypage/version" element={<VersionInfo />} />
                      <Route path="/mypage/posts" element={<MyPosts />} />
                      <Route path="/mypage/comments" element={<MyComments />} />
                      <Route element={<MyInfoProvider />}>
                        <Route path="/my-info" element={<MyInfoView />} />
                        <Route path="/my-info/edit" element={<MyInfoEdit />} />
                      </Route>
                      <Route element={<OnboardingProvider />}>
                        <Route path="/onboarding/1" element={<Onboarding1 />} />
                        <Route path="/onboarding/2" element={<Onboarding2 />} />
                        <Route path="/onboarding/3" element={<Onboarding3 />} />
                        <Route path="/onboarding/4" element={<Onboarding4 />} />
                        <Route path="/onboarding/5" element={<Onboarding5 />} />
                        <Route path="/onboarding/6" element={<Onboarding6 />} />
                        <Route path="/onboarding/7" element={<Onboarding7 />} />
                        <Route path="/onboarding/8" element={<Onboarding8 />} />
                        <Route path="/onboarding/9" element={<Onboarding9 />} />
                        <Route path="/onboarding/10" element={<Onboarding10 />} />
                        <Route path="/onboarding/11" element={<Onboarding11 />} />
                        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
