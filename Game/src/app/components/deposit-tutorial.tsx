import { useState } from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const TUTORIAL_VIDEOS = [
  {
    id: 'telebirr',
    title: 'Telebirr Deposit',
    titleAmharic: 'ቴሌ ብር',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect width="800" height="450" fill="%23059669"/%3E%3Ctext x="50%25" y="45%25" fill="white" font-size="48" font-family="system-ui" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3ETelebirr%3C/text%3E%3Ctext x="50%25" y="55%25" fill="white" font-size="24" font-family="system-ui" text-anchor="middle" dominant-baseline="middle"%3EDeposit Tutorial%3C/text%3E%3C/svg%3E',
    description: 'Learn how to deposit using Telebirr',
    descriptionAmharic: 'በቴሌ ብር እንዴት እንደሚያስቀምጡ ይማሩ',
  },
  {
    id: 'cbebirr',
    title: 'CBE Birr Deposit',
    titleAmharic: 'ሲቢኢ ብር',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect width="800" height="450" fill="%232563eb"/%3E%3Ctext x="50%25" y="45%25" fill="white" font-size="48" font-family="system-ui" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3ECBE Birr%3C/text%3E%3Ctext x="50%25" y="55%25" fill="white" font-size="24" font-family="system-ui" text-anchor="middle" dominant-baseline="middle"%3EDeposit Tutorial%3C/text%3E%3C/svg%3E',
    description: 'Learn how to deposit using CBE Birr',
    descriptionAmharic: 'በሲቢኢ ብር እንዴት እንደሚያስቀምጡ ይማሩ',
  },
  {
    id: 'bank',
    title: 'Bank Transfer',
    titleAmharic: 'ባንክ ትራንስፈር',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect width="800" height="450" fill="%23dc2626"/%3E%3Ctext x="50%25" y="45%25" fill="white" font-size="48" font-family="system-ui" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EBank Transfer%3C/text%3E%3Ctext x="50%25" y="55%25" fill="white" font-size="24" font-family="system-ui" text-anchor="middle" dominant-baseline="middle"%3EDeposit Tutorial%3C/text%3E%3C/svg%3E',
    description: 'Learn how to deposit via bank transfer',
    descriptionAmharic: 'በባንክ ትራንስፈር እንዴት እንደሚያስቀምጡ ይማሩ',
  },
  {
    id: 'crypto',
    title: 'Crypto Deposit',
    titleAmharic: 'ክሪፕቶ',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect width="800" height="450" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="45%25" fill="white" font-size="48" font-family="system-ui" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3E₿ Crypto%3C/text%3E%3Ctext x="50%25" y="55%25" fill="white" font-size="24" font-family="system-ui" text-anchor="middle" dominant-baseline="middle"%3EDeposit Tutorial%3C/text%3E%3C/svg%3E',
    description: 'Learn how to deposit using cryptocurrency',
    descriptionAmharic: 'በክሪፕቶ እንዴት እንደሚያስቀምጡ ይማሩ',
  },
];

export function DepositTutorial() {
  const [selectedVideo, setSelectedVideo] = useState(TUTORIAL_VIDEOS[0]);

  return (
    <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <PlayCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-blue-300">
          እንዴት እንደሚያስቀምጡ ይመልከቱ / Watch Deposit Tutorials
        </h3>
      </div>

      <Tabs defaultValue={TUTORIAL_VIDEOS[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-4">
          {TUTORIAL_VIDEOS.map((video) => (
            <TabsTrigger
              key={video.id}
              value={video.id}
              onClick={() => setSelectedVideo(video)}
              className="text-xs data-[state=active]:bg-blue-600"
            >
              {video.titleAmharic}
            </TabsTrigger>
          ))}
        </TabsList>

        {TUTORIAL_VIDEOS.map((video) => (
          <TabsContent key={video.id} value={video.id} className="m-0">
            <div className="space-y-3">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <video
                  controls
                  className="w-full h-full"
                  poster={video.thumbnail}
                  key={video.id}
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">
                      {video.titleAmharic} - {video.title}
                    </h4>
                    <p className="text-sm text-gray-300 mt-1">
                      {video.descriptionAmharic}
                    </p>
                    <p className="text-xs text-gray-400">{video.description}</p>
                  </div>
                </div>

                {/* Tutorial Steps */}
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2 font-semibold">
                    📝 Quick Steps / ፈጣን ደረጃዎች:
                  </p>
                  <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Open your {video.title} app / መተግበሪያውን ይክፈቱ</li>
                    <li>Select transfer or payment / ማስተላለፊያን ይምረጡ</li>
                    <li>Enter our account number / መለያ ቁጥራችንን ያስገቡ</li>
                    <li>Confirm and complete / ያረጋግጡ እና ያጠናቅቁ</li>
                  </ol>
                </div>
              </div>

              {/* Support Notice */}
              <div className="bg-yellow-950/30 border border-yellow-600/30 rounded-lg p-3">
                <p className="text-xs text-yellow-300 flex items-center gap-2">
                  <span>💡</span>
                  <span>
                    ችግር ካጋጠመዎት የደንበኛ አገልግሎታችንን ያነጋግሩ / If you have issues, contact
                    our support team 24/7
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
