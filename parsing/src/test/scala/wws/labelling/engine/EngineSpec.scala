package wws.labelling.engine

import org.scalatest.{Matchers, WordSpec}
import wws.labeling.client.Segments.Segment
import wws.labeling.engine.Engine

/**
  * Created by weil1 on 11/27/16.
  */
class EngineSpec extends WordSpec with Matchers {
  import wws.tokenization.Lexer._
  "engine should tokenize" in {
    tokenize("hello world") shouldBe List(("hello", 0, 4), ("world", 6, 10))
    tokenize(" a b c ") shouldBe List(("a", 1, 1), ("b", 3, 3), ("c", 5, 5))
    tokenize("a") shouldBe List(("a", 0, 0))
    tokenize("\ta") shouldBe List(("a", 1, 1))
    tokenize("") shouldBe List.empty[(String, Int, Int)]
    tokenize("    ") shouldBe List.empty[(String, Int, Int)]
    tokenize("\t") shouldBe List.empty[(String, Int, Int)]
  }

  "engine should compute text segmentation" in {
    segment("a b") shouldBe List(("a", 0, 0), (" ", 1, 1), ("b", 2, 2))
    segment("a") shouldBe List(("a", 0, 0))
    segment("\ta") shouldBe List(("\t", 0, 0), ("a", 1, 1))
    segment("") shouldBe  List.empty[(String, Int, Int)]
    segment("    ") shouldBe List(("    ", 0, 3))
    segment("    a") shouldBe List(("    ", 0, 3), ("a", 4, 4))
  }

  def tokenize(query: String): List[(String, Int, Int)] = {
    Engine.tokenize(query).map(token2Tuple)
  }

  def segment(query: String): List[(String, Int, Int)] = {
    val converter = segment2Tuple(query)
    Engine.createSegmentation(query).segmentation.segments.map(converter)
  }

  def token2Tuple(tm: TokenMatch) = {
    (tm.token.chars, tm.start.offset, tm.end.offset)
  }

  def segment2Tuple(query: String) = {
    (seg: Segment) =>   (query.substring(seg.start.offset, seg.end.offset + 1), seg.start.offset, seg.end.offset)
  }
}
