package wws.labeling.engine

import org.scalatest.{Matchers, WordSpec}
import wws.labeling.client.Segments.Segment
import wws.labeling.engine.Engine
import spray.json._
import wws.tokenization.ExtendedTokens.{FloatLit, IntegerLit}

/**
  * Created by weil1 on 11/27/16.
  */
class EngineSpec extends WordSpec with Matchers {

  import wws.tokenization.Lexer._
  import wws.labeling.client.Segments._

  "engine should tokenize and mark token boundaries" in {
    tokenize("hello world") shouldBe List(("hello", 0, 4), ("world", 6, 10))
    tokenize(" a b c ") shouldBe List(("a", 1, 1), ("b", 3, 3), ("c", 5, 5))
    tokenize("a") shouldBe List(("a", 0, 0))
    tokenize("\ta") shouldBe List(("a", 1, 1))
    tokenize("") shouldBe List.empty[(String, Int, Int)]
    tokenize("    ") shouldBe List.empty[(String, Int, Int)]
    tokenize("\t") shouldBe List.empty[(String, Int, Int)]
    tokenize("255 E Pike") shouldBe List(("255", 0, 2), ("E", 4, 4), ("Pike", 6, 9))
  }

  "engine should recognize numbers" in {
    tokens("1") should equal(IntegerLit("1", 1) :: Nil)
    tokens("-1") should equal(IntegerLit("-1", -1) :: Nil)
    tokens("1e1") should equal(RawToken("1e1") :: Nil)
    tokens("0.1") should equal(FloatLit("0.1", 0.1) :: Nil)
    tokens("-0.1") should equal(FloatLit("-0.1", -0.1) :: Nil)
  }

  "engine should compute text segmentation" in {
    segment("a b") shouldBe List(("a", 0, 0), (" ", 1, 1), ("b", 2, 2))
    segment("a") shouldBe List(("a", 0, 0))
    segment("\ta") shouldBe List(("\t", 0, 0), ("a", 1, 1))
    segment("") shouldBe List.empty[(String, Int, Int)]
    segment("    ") shouldBe List(("    ", 0, 3))
    segment("    a") shouldBe List(("    ", 0, 3), ("a", 4, 4))
  }

  "engine should produce segment data that serializes to client-side JSON" in {
    // This test is important to guard against changes that break client (javascript) - server (scala) contract
    clientJson("a b") shouldBe """{"query":"a b","segmentation":{"segments":[{"start":{"row":0,"col":0,"offset":0},"end":{"row":0,"col":0,"offset":0},"kind":0},{"start":{"row":0,"col":1,"offset":1},"end":{"row":0,"col":1,"offset":1},"kind":1},{"start":{"row":0,"col":2,"offset":2},"end":{"row":0,"col":2,"offset":2},"kind":0}]}}"""
    clientJson("") shouldBe """{"query":"","segmentation":{"segments":[]}}"""
  }

  def tokens(query: String) = Engine.tokenize(query).map(e => e.token)

  def tokenize(query: String): List[(String, Int, Int)] = {
    Engine.tokenize(query).map(token2Tuple)
  }

  def clientJson(query: String) = {
    val jsonText = Engine.createClientJson(query).compactPrint
    print(jsonText)
    jsonText

  }

  private def createSegmentation(query: String) = {
    Engine.createSegmentation(query)
  }

  def segment(query: String): List[(String, Int, Int)] = {
    val converter = segment2Tuple(query)
    createSegmentation(query).segmentation.segments.map(converter)
  }

  def token2Tuple(tm: TokenMatch) = {
    (tm.token.chars, tm.start.offset, tm.end.offset)
  }

  def segment2Tuple(query: String) = {
    (seg: Segment) => (query.substring(seg.start.offset, seg.end.offset + 1), seg.start.offset, seg.end.offset)
  }
}
