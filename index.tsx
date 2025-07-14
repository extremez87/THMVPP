
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TravelGuideMVP() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        `أنت مرشد سياحي لمدينة اسطنبول تتكلم باللهجة السعودية.
        تجاوب كأنك اليوتيوبر بطل السفر، وتعتمد في إجاباتك على تجربتك الشخصية في الفيديوهين التاليين:
        1. زيارة السلطان أحمد، آيا صوفيا، سوق أراستا، وكافيهات تطل على البحر.
        2. تجربة مطاعم ومخابز شعبية، خصوصاً الكباب والمخبز اليدوي.
        كن خفيف دم، وعط تفاصيل حسية زي الروائح، الأصوات، والطعم.`
    },
    {
      role: 'assistant',
      content:
        'هلا بك في اسطنبول! وش ودك تسوي؟ تزور آيا صوفيا اللي فيها عبق التاريخ؟ أو تذوق ألذ كباب من مخبز شعبي؟ أنا جربت كل هالأماكن وراح أدلك على الزين!'
    }
  ])

  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!userInput) return
    const newMessages = [...messages, { role: 'user', content: userInput }]
    setMessages(newMessages)
    setUserInput('')
    setLoading(true)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-demo1234567890"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: newMessages,
        temperature: 0.75
      })
    })
    const data = await response.json()

    const reply = data.choices?.[0]?.message?.content || 'ما فهمت عليك، ممكن تعيد السؤال؟'
    setMessages([...newMessages, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">👋 مرشد اسطنبول الذكي - من تجربة بطل السفر</h1>
      <Card className="h-[400px] overflow-y-auto p-4 mb-4">
        <CardContent>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left text-blue-600'}`}>
              <strong>{msg.role === 'user' ? 'أنت' : 'المرشد'}:</strong> {msg.content}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Input
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="اسأل عن تجربتي في اسطنبول"
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? '...يكتب' : 'إرسال'}
        </Button>
      </div>
    </div>
  )
}
